export const isPrintRoute = () => typeof window !== "undefined" && window.location.pathname.startsWith("/print");

export function getSafeNext(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/login") && !next.startsWith("/register")
    ? next
    : fallback;
}

export const loginUrlWithNext = () =>
  typeof window === "undefined" ? "/login" : `/login?next=${encodeURIComponent(window.location.pathname)}`;
