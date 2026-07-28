import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProviderResource } from "./index.mjs";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("provider fetch boundary", () => {
  it("rejects redirects instead of following them outside the allowlist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 302,
          headers: { Location: "https://example.com/redirected" },
        }),
      ),
    );

    await expect(
      fetchProviderResource(
        new URL("https://mypiercing.com.br/image.jpg"),
        {},
        "Falha.",
      ),
    ).rejects.toThrow("URL não autorizada");
    expect(fetch).toHaveBeenCalledWith(
      new URL("https://mypiercing.com.br/image.jpg"),
      expect.objectContaining({ redirect: "manual" }),
    );
  });
});
