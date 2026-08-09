import type { QuestionOption, QuestionType } from '../types'
import MathText from './MathText'
import { ZoomableImage } from './ImageViewer'

export default function QuestionOptionItem({
  option,
  type,
  selected,
  onToggle,
  name,
  onZoomImage,
}: {
  option: QuestionOption
  type: QuestionType
  selected: boolean
  onToggle: () => void
  name: string
  onZoomImage: (src: string, alt: string) => void
}) {
  const isCheckbox = type === 'multiple-choice'

  return (
    <label
      className={`flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors select-none
        ${selected ? 'border-examblue bg-examblue-light/70 ring-1 ring-examblue' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
    >
      <input
        type={isCheckbox ? 'checkbox' : 'radio'}
        name={name}
        checked={selected}
        onChange={onToggle}
        className="mt-1 w-4 h-4 accent-examblue shrink-0"
        aria-label={`Pilihan ${option.id}`}
      />
      <span className="flex-1 min-w-0">
        <span className="font-semibold text-gray-500 mr-1.5">{option.id}.</span>
        {option.text && (
          <MathText text={option.text} className="inline text-[0.95rem] text-gray-800" />
        )}
        {option.image && (
          <span className="block mt-2">
            <ZoomableImage
              src={option.image}
              alt={`Pilihan ${option.id}`}
              onOpen={onZoomImage}
              className="max-w-xs"
            />
          </span>
        )}
      </span>
    </label>
  )
}
