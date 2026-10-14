/**
 * Sehr einfache Absicherung wie templ.SafeURL: verhindert javascript:-URIs.
 * Für produktiven Einsatz ggf. durch eine ausgereiftere URL-Validierung ersetzen.
 */
export function safeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("javascript:")) return "about:blank#unsafe-url";
  return url;
}
