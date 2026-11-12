/**
 * Resuelve la portada que entrega el backend. Puede venir como URL absoluta
 * (Deezer, iTunes, Cover Art Archive) o como ruta relativa servida por el
 * propio servidor (`/uploads/...`).
 */
export function coverUrlFor(
  portadaUrl: string | null | undefined,
  baseUrl: string | null | undefined,
): string | undefined {
  const raw = portadaUrl?.trim();
  if (!raw) return undefined;
  if (/^data:image\//i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (!baseUrl) return undefined;

  try {
    const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return new URL(raw.replace(/^\.?\//, ""), base).toString();
  } catch {
    return undefined;
  }
}
