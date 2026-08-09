import { useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'

export function ZoomableImage({
  src,
  alt,
  className,
  onOpen,
}: {
  src: string
  alt: string
  className?: string
  onOpen: (src: string, alt: string) => void
}) {
  return (
    <div className={`relative inline-block group ${className ?? ''}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="rounded-lg border border-gray-200 max-w-full h-auto bg-white cursor-zoom-in"
        onClick={() => onOpen(src, alt)}
      />
      <button
        type="button"
        onClick={() => onOpen(src, alt)}
        aria-label={`Perbesar gambar: ${alt}`}
        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow flex items-center gap-1 border border-gray-200"
      >
        <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
        Perbesar
      </button>
    </div>
  )
}

export default function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    if (!src) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-fade-slide"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Perbesar gambar"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-4 right-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
