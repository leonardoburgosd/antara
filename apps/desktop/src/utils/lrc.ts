/** Línea de letra con su marca de tiempo en milisegundos. */
export type LyricLine = {
  timeMs: number;
  text: string;
};

/**
 * Parser del formato LRC estándar (`[mm:ss.xx]texto`), el que devuelve
 * `GET /api/pista/{id}/letra-sincronizada` desde LRCLIB.
 *
 * Admite varias marcas de tiempo en la misma línea (una letra repetida) e
 * ignora etiquetas de metadatos como `[ar:Artista]` o `[ti:Título]`.
 */
export function parseLrc(raw: string): LyricLine[] {
  if (!raw.trim()) return [];

  const timeTag = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  const lines: LyricLine[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const matches = [...line.matchAll(timeTag)];
    if (matches.length === 0) continue;

    const lastMatch = matches[matches.length - 1];
    const text = line.slice(lastMatch.index + lastMatch[0].length).trim();
    if (!text) continue;

    for (const match of matches) {
      const minutes = Number.parseInt(match[1], 10);
      const seconds = Number.parseInt(match[2], 10);
      if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) continue;

      lines.push({
        timeMs: minutes * 60_000 + seconds * 1_000 + fractionMs(match[3]),
        text,
      });
    }
  }

  return lines.sort((a, b) => a.timeMs - b.timeMs);
}

/** Índice de la línea que suena en `positionSeconds`; `-1` antes de la primera. */
export function activeLyricIndex(lines: LyricLine[], positionSeconds: number): number {
  const positionMs = positionSeconds * 1_000;

  let result = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].timeMs <= positionMs) result = index;
    else break;
  }
  return result;
}

/** Convierte la fracción decimal del LRC (`.5`, `.50`, `.500`) a milisegundos. */
function fractionMs(fraction: string | undefined): number {
  if (!fraction) return 0;
  if (fraction.length === 1) return Number(fraction) * 100;
  if (fraction.length === 2) return Number(fraction) * 10;
  return Number(fraction.slice(0, 3));
}
