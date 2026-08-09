import { Fragment } from 'react'
import katex from 'katex'

/**
 * Merender teks yang bisa mengandung:
 *  - $...$   -> rumus matematika inline (KaTeX)
 *  - $$...$$ -> rumus matematika block/display (KaTeX)
 *  - *teks*  -> italic (dipakai untuk istilah asing spt "online", "cashback")
 *  - **teks**-> bold (dipakai untuk sub-judul kecil dalam paragraf soal)
 *  - baris kosong ganda -> paragraf baru
 *  - baris diawali "- " -> item daftar (bullet)
 *
 * Ini BUKAN markdown lengkap - sengaja dibatasi supaya konten soal (yang
 * berasal dari PDF sumber) bisa ditranskripsi apa adanya tanpa mengubah
 * makna, sekaligus tetap bisa menampilkan notasi matematika dengan rapi.
 */

function renderKatex(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr, {
      throwOnError: false,
      displayMode,
    })
  } catch {
    return expr
  }
}

function renderInlineSegments(text: string, keyPrefix: string) {
  // Pecah berdasarkan $$...$$ dan $...$ untuk math, serta **...** dan *...*
  const nodes: React.ReactNode[] = []
  // Tokenizer sederhana
  const pattern = /(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|\*[^*]+\*)/g
  const parts = text.split(pattern)
  parts.forEach((part, idx) => {
    if (!part) return
    const key = `${keyPrefix}-${idx}`
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const expr = part.slice(2, -2)
      nodes.push(
        <span
          key={key}
          className="inline-block my-1"
          dangerouslySetInnerHTML={{ __html: renderKatex(expr, true) }}
        />
      )
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const expr = part.slice(1, -1)
      nodes.push(
        <span key={key} dangerouslySetInnerHTML={{ __html: renderKatex(expr, false) }} />
      )
    } else if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(<strong key={key}>{part.slice(2, -2)}</strong>)
    } else if (part.startsWith('*') && part.endsWith('*')) {
      nodes.push(<em key={key}>{part.slice(1, -1)}</em>)
    } else {
      nodes.push(<Fragment key={key}>{part}</Fragment>)
    }
  })
  return nodes
}

export default function MathText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  if (!text) return null
  const paragraphs = text.split(/\n\n+/)

  return (
    <div className={className}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n')
        const isList = lines.every((l) => l.trim().startsWith('- ')) && lines.length > 0
        if (isList) {
          return (
            <ul key={pIdx} className="list-disc pl-5 my-2 space-y-1">
              {lines.map((l, lIdx) => (
                <li key={lIdx}>{renderInlineSegments(l.trim().slice(2), `${pIdx}-${lIdx}`)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={pIdx} className={pIdx > 0 ? 'mt-3' : ''}>
            {lines.map((line, lIdx) => (
              <Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineSegments(line, `${pIdx}-${lIdx}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
