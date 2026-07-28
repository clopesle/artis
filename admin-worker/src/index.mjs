import {
  normalizeWooProducts,
  parseAngelSearch,
  validateProviderAssetUrl,
  validateProviderUrl,
} from "./provider-catalog.mjs";
import {
  assertAllowedRepositoryPath,
  assertAllowedRepositoryWritePath,
  hasWritePermission,
  parseBearerToken,
} from "./security.mjs";

const API_VERSION = "2022-11-28";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value) {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function utf8ToBase64(value) {
  const bytes = new TextEncoder().encode(value);
  return btoa(String.fromCharCode(...bytes));
}

function base64ToUtf8(value) {
  const bytes = Uint8Array.from(atob(value.replace(/\s/g, "")), (character) =>
    character.charCodeAt(0),
  );
  return new TextDecoder().decode(bytes);
}

function randomToken(size = 32) {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(size)));
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)),
  );
}

async function createState(env) {
  const payload = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify({
        issuedAt: Date.now(),
        nonce: randomToken(18),
      }),
    ),
  );
  const signature = base64UrlEncode(await hmac(payload, env.STATE_SECRET));
  return `${payload}.${signature}`;
}

async function verifyState(state, env) {
  const [payload, signature] = state.split(".");
  if (!payload || !signature) return false;

  const expected = await hmac(payload, env.STATE_SECRET);
  const actual = base64UrlDecode(signature);
  if (actual.length !== expected.length) return false;

  let mismatch = 0;
  for (let index = 0; index < actual.length; index += 1) {
    mismatch |= actual[index] ^ expected[index];
  }
  if (mismatch !== 0) return false;

  const parsed = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
  return Date.now() - parsed.issuedAt < 10 * 60 * 1000;
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ADMIN_ORIGIN,
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data, status, env, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(env),
      ...extraHeaders,
    },
  });
}

function assertOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== env.ADMIN_ORIGIN) {
    throw new Error("Origem administrativa não permitida.");
  }
}

function githubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "artis-admin-bridge",
  };
}

async function githubRequest(env, token, path, init = {}) {
  const apiBaseUrl = env.GITHUB_API_URL || "https://api.github.com";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...githubHeaders(token),
      ...(init.headers ?? {}),
    },
  });

  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(body?.message ?? "Falha na API do GitHub.");
    error.status = response.status;
    throw error;
  }

  return body;
}

async function getRepository(env, token) {
  return githubRequest(env, token, `/repos/${env.GITHUB_REPOSITORY}`);
}

async function createSession(env, token, user, expiresIn) {
  const sessionId = randomToken();
  const ttl = Math.min(Number(expiresIn) || SESSION_TTL_SECONDS, SESSION_TTL_SECONDS);
  await env.SESSIONS.put(
    sessionId,
    JSON.stringify({
      token,
      user: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
      },
      expiresAt: Date.now() + ttl * 1000,
    }),
    { expirationTtl: ttl },
  );
  return sessionId;
}

async function requireSession(request, env) {
  const sessionId = parseBearerToken(request);
  if (!sessionId) {
    const error = new Error("Sessão administrativa ausente.");
    error.status = 401;
    throw error;
  }

  const session = await env.SESSIONS.get(sessionId, "json");
  if (!session || session.expiresAt <= Date.now()) {
    const error = new Error("Sessão expirada. Entre novamente com o GitHub.");
    error.status = 401;
    throw error;
  }

  return { ...session, sessionId };
}

async function getContent(env, token, path) {
  const ref = encodeURIComponent(env.GITHUB_BRANCH || "main");
  return githubRequest(
    env,
    token,
    `/repos/${env.GITHUB_REPOSITORY}/contents/${path}?ref=${ref}`,
  );
}

async function readJsonContent(env, token, path) {
  const file = await getContent(env, token, path);
  return JSON.parse(base64ToUtf8(file.content));
}

async function handleLogin(env) {
  const state = await createState(env);
  const authorization = new URL("https://github.com/login/oauth/authorize");
  authorization.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorization.searchParams.set("redirect_uri", `${env.BRIDGE_URL}/auth/callback`);
  authorization.searchParams.set("state", state);
  authorization.searchParams.set("allow_signup", "false");
  return Response.redirect(authorization.toString(), 302);
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";
  if (!code || !(await verifyState(state, env))) {
    return Response.redirect(`${env.ADMIN_URL}?auth=invalid`, 302);
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${env.BRIDGE_URL}/auth/callback`,
    }),
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    return Response.redirect(`${env.ADMIN_URL}?auth=failed`, 302);
  }

  const [user, repository] = await Promise.all([
    githubRequest(env, tokenData.access_token, "/user"),
    getRepository(env, tokenData.access_token),
  ]);
  if (!hasWritePermission(repository)) {
    return Response.redirect(`${env.ADMIN_URL}?auth=forbidden`, 302);
  }

  const sessionId = await createSession(
    env,
    tokenData.access_token,
    user,
    tokenData.expires_in,
  );
  return Response.redirect(`${env.ADMIN_URL}#session=${sessionId}`, 302);
}

async function handleContent(request, env, session) {
  const url = new URL(request.url);

  if (request.method === "GET") {
    const path = assertAllowedRepositoryPath(url.searchParams.get("path") ?? "");
    return json(await getContent(env, session.token, path), 200, env);
  }

  const body = await request.json();
  const path = assertAllowedRepositoryWritePath(body.path);
  if (request.method === "DELETE") {
    const result = await githubRequest(
      env,
      session.token,
      `/repos/${env.GITHUB_REPOSITORY}/contents/${path}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: body.message,
          sha: body.sha,
          branch: env.GITHUB_BRANCH || "main",
        }),
      },
    );
    return json(result, 200, env);
  }

  const content =
    body.encoding === "base64"
      ? body.content.replace(/\s/g, "")
      : utf8ToBase64(body.content);
  const result = await githubRequest(
    env,
    session.token,
    `/repos/${env.GITHUB_REPOSITORY}/contents/${path}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        content,
        ...(body.sha ? { sha: body.sha } : {}),
        branch: env.GITHUB_BRANCH || "main",
      }),
    },
  );
  return json(result, 200, env);
}

async function findProvider(env, token, providerId) {
  const providers = await readJsonContent(env, token, "admin/providers.json");
  const provider = providers.find((item) => item.id === providerId && item.enabled);
  if (!provider) throw new Error("Fornecedor ativo não encontrado.");
  validateProviderUrl(provider);
  return provider;
}

export async function fetchProviderResource(url, init, errorMessage) {
  let response;
  try {
    response = await fetch(url, { ...init, redirect: "manual" });
  } catch {
    throw new Error(errorMessage);
  }

  if (response.status >= 300 && response.status < 400) {
    throw new Error("O fornecedor redirecionou para uma URL não autorizada.");
  }

  return response;
}

async function handleProviderSearch(request, env, session) {
  const { providerId, query } = await request.json();
  if (typeof query !== "string" || query.trim().length < 2) {
    return json({ message: "Digite pelo menos dois caracteres." }, 400, env);
  }

  const provider = await findProvider(env, session.token, providerId);
  let candidates;

  if (provider.type === "woocommerce") {
    const url = validateProviderUrl(
      provider,
      `${provider.baseUrl}/wp-json/wc/store/v1/products?search=${encodeURIComponent(
        query.trim(),
      )}&per_page=40`,
    );
    const response = await fetchProviderResource(
      url,
      {
        headers: { Accept: "application/json", "User-Agent": "artis-admin-bridge" },
      },
      "Não foi possível consultar este fornecedor.",
    );
    if (!response.ok) throw new Error("Não foi possível consultar este fornecedor.");
    candidates = normalizeWooProducts(await response.json(), provider);
  } else {
    const url = validateProviderUrl(
      provider,
      `${provider.baseUrl}/buscar?q=${encodeURIComponent(query.trim())}`,
    );
    const response = await fetchProviderResource(
      url,
      {
        headers: { Accept: "text/html", "User-Agent": "artis-admin-bridge" },
      },
      "Não foi possível consultar este fornecedor.",
    );
    if (!response.ok) throw new Error("Não foi possível consultar este fornecedor.");
    candidates = parseAngelSearch(await response.text(), provider);
  }

  return json({ candidates }, 200, env);
}

async function handleProviderImage(request, env, session) {
  const { providerId, url } = await request.json();
  const provider = await findProvider(env, session.token, providerId);
  const assetUrl = validateProviderAssetUrl(provider, url);
  const response = await fetchProviderResource(
    assetUrl,
    {
      headers: { Accept: "image/*", "User-Agent": "artis-admin-bridge" },
    },
    "A imagem do fornecedor não pôde ser importada.",
  );
  const contentType = response.headers.get("Content-Type") ?? "";
  const contentLength = Number(response.headers.get("Content-Length") || 0);
  if (
    !response.ok ||
    !contentType.startsWith("image/") ||
    contentLength > 5 * 1024 * 1024
  ) {
    throw new Error("A imagem do fornecedor não pôde ser importada.");
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > 5 * 1024 * 1024) {
    throw new Error("A imagem excede o limite de 5 MB.");
  }

  return new Response(bytes, {
    status: 200,
    headers: {
      ...corsHeaders(env),
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}

async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") {
    assertOrigin(request, env);
    return new Response(null, { status: 204, headers: corsHeaders(env) });
  }

  if (url.pathname === "/auth/login" && request.method === "GET") {
    return handleLogin(env);
  }
  if (url.pathname === "/auth/callback" && request.method === "GET") {
    return handleCallback(request, env);
  }

  assertOrigin(request, env);
  const session = await requireSession(request, env);

  if (url.pathname === "/api/session" && request.method === "GET") {
    return json(
      {
        user: session.user,
        expiresAt: session.expiresAt,
        repository: env.GITHUB_REPOSITORY,
      },
      200,
      env,
    );
  }
  if (url.pathname === "/api/session" && request.method === "DELETE") {
    await env.SESSIONS.delete(session.sessionId);
    return json({ ok: true }, 200, env);
  }
  if (
    url.pathname === "/api/content" &&
    ["GET", "PUT", "DELETE"].includes(request.method)
  ) {
    return handleContent(request, env, session);
  }
  if (url.pathname === "/api/providers/search" && request.method === "POST") {
    return handleProviderSearch(request, env, session);
  }
  if (url.pathname === "/api/providers/image" && request.method === "POST") {
    return handleProviderImage(request, env, session);
  }

  return json({ message: "Rota não encontrada." }, 404, env);
}

export default {
  async fetch(request, env) {
    try {
      return await route(request, env);
    } catch (error) {
      return json(
        { message: error.message || "Erro inesperado na administração." },
        error.status || 500,
        env,
      );
    }
  },
};
