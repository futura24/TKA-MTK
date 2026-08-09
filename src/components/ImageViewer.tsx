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

      {/* Tombol Zoom - hanya ikon */}
      <button
        type="button"
        onClick={() => onOpen(src, alt)}
        aria-label={`Perbesar gambar: ${alt}`}
        title="Perbesar gambar"
        className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-gray-700 rounded-full shadow border border-gray-200 transition-all duration-200 hover:scale-105"
      >
        <ZoomIn className="w-5 h-5" />
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
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau gambar"
    >
      {/* Tombol Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup gambar"
        title="Tutup"
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg transition-all duration-200 hover:scale-105"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Gambar */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
