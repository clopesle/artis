export function withBase(pathname: string, base = import.meta.env.BASE_URL) {
  const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `${normalizedBase}${normalizedPath}`;
}
