package com.antara.app.features.player

/** Línea de letra con su marca de tiempo en milisegundos. */
data class LyricLine(
    val timeMs: Long,
    val text: String,
)

/**
 * Parser del formato LRC estándar (`[mm:ss.xx]texto`), el que devuelve
 * `GET /api/pista/{id}/letra-sincronizada` desde LRCLIB.
 *
 * Admite varias marcas de tiempo en la misma línea (una letra repetida) e
 * ignora etiquetas de metadatos como `[ar:Artista]` o `[ti:Título]`.
 */
object LrcParser {

    private val TIME_TAG = Regex("\\[(\\d{1,3}):(\\d{1,2})(?:[.:](\\d{1,3}))?]")

    fun parse(raw: String): List<LyricLine> {
        if (raw.isBlank()) return emptyList()

        val lines = mutableListOf<LyricLine>()
        raw.lineSequence().forEach { line ->
            val matches = TIME_TAG.findAll(line).toList()
            if (matches.isEmpty()) return@forEach

            val text = line.substring(matches.last().range.last + 1).trim()
            if (text.isEmpty()) return@forEach

            for (match in matches) {
                val minutes = match.groupValues[1].toLongOrNull() ?: continue
                val seconds = match.groupValues[2].toLongOrNull() ?: continue
                lines += LyricLine(
                    timeMs = minutes * 60_000L + seconds * 1_000L + fractionMs(match.groupValues[3]),
                    text = text,
                )
            }
        }

        return lines.sortedBy { it.timeMs }
    }

    /** Índice de la línea que suena en `positionMs`; `-1` antes de la primera. */
    fun activeIndex(lines: List<LyricLine>, positionMs: Long): Int {
        if (lines.isEmpty()) return -1

        var result = -1
        for (index in lines.indices) {
            if (lines[index].timeMs <= positionMs) result = index else break
        }
        return result
    }

    /** Convierte la fracción decimal del LRC (`.5`, `.50`, `.500`) a milisegundos. */
    private fun fractionMs(fraction: String): Long = when (fraction.length) {
        0 -> 0L
        1 -> fraction.toLong() * 100L
        2 -> fraction.toLong() * 10L
        else -> fraction.take(3).toLong()
    }
}
