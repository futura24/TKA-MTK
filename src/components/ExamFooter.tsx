import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'

export default function ExamFooter({
  onPrev,
  onNext,
  onMark,
  marked,
  isFirst,
  isLast,
  onFinish,
}: {
  onPrev: () => void
  onNext: () => void
  onMark: () => void
  marked: boolean
  isFirst: boolean
  isLast: boolean
  onFinish: () => void
}) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Soal</span> Sebelumnya
      </button>

      <button
        type="button"
        onClick={onMark}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors border
          ${marked ? 'bg-amber-500 border-amber-500 text-white' : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'}`}
      >
        <Flag className="w-4 h-4" fill={marked ? 'currentColor' : 'none'} />
        {marked ? 'Ditandai' : 'Tandai'}
      </button>

      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-examblue hover:bg-examblue-dark text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          Selesai Ujian
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-examblue hover:bg-examblue-dark text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <span className="hidden sm:inline">Soal</span> Berikutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
