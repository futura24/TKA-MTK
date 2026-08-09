import type { Stimulus } from '../types'
import MathText from './MathText'
import { ZoomableImage } from './ImageViewer'
import { BookOpen } from 'lucide-react'

export default function StimulusCard({
  stimulus,
  onZoomImage,
}: {
  stimulus: Stimulus
  onZoomImage: (src: string, alt: string) => void
}) {
  return (
    <div className="bg-examblue-light/60 border border-examblue/20 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 text-examblue-dark font-semibold text-sm mb-2">
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        <span>{stimulus.title}</span>
      </div>
      <MathText text={stimulus.content} className="text-[0.95rem] leading-relaxed text-gray-800" />
      {stimulus.image && (
        <div className="mt-3">
          <ZoomableImage src={stimulus.image} alt={stimulus.title} onOpen={onZoomImage} />
        </div>
      )}
      {stimulus.images?.map((img, i) => (
        <div className="mt-3" key={i}>
          <ZoomableImage src={img} alt={`${stimulus.title} - gambar ${i + 1}`} onOpen={onZoomImage} />
        </div>
      ))}
    </div>
  )
}
