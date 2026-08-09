import type { AnswersMap, Question } from '../types'
import { countByStatus, getQuestionStatus } from '../utils/questionUtils'
import { X } from 'lucide-react'

function statusClasses(status: string, isActive: boolean, urgent: boolean) {
  if (isActive) return 'bg-examblue text-white border-examblue ring-2 ring-examblue/40'
  if (status === 'answered') return 'bg-green-100 text-green-800 border-green-300'
  if (status === 'marked') return 'bg-amber-100 text-amber-800 border-amber-300'
  if (status === 'unanswered' && urgent) return 'bg-red-100 text-red-700 border-red-300'
  return 'bg-gray-100 text-gray-600 border-gray-300'
}

export function QuestionNavigatorGrid({
  questions,
  answers,
  currentIndex,
  onSelect,
  urgent = false,
}: {
  questions: Question[]
  answers: AnswersMap
  currentIndex: number
  onSelect: (index: number) => void
  urgent?: boolean
}) {
  const counts = countByStatus(answers, questions)

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((q, idx) => {
          const status = getQuestionStatus(answers, q.id)
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelect(idx)}
              className={`aspect-square rounded-lg border text-sm font-semibold flex items-center justify-center transition-colors ${statusClasses(
                status,
                idx === currentIndex,
                urgent
              )}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
              aria-label={`Soal nomor ${q.number}, status ${status}`}
            >
              {q.number}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
        <LegendDot colorClass="bg-gray-200 border-gray-300" label="Belum dijawab" />
        <LegendDot colorClass="bg-green-100 border-green-300" label="Sudah dijawab" />
        <LegendDot colorClass="bg-amber-100 border-amber-300" label="Ditandai" />
        <LegendDot colorClass="bg-examblue border-examblue" label="Soal aktif" />
        {urgent && (
          <LegendDot colorClass="bg-red-100 border-red-300" label="Belum dijawab, waktu hampir habis" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <SummaryBox label="Terjawab" value={counts.answered} colorClass="text-green-700 bg-green-50" />
        <SummaryBox label="Belum" value={counts.unanswered} colorClass="text-gray-600 bg-gray-50" />
        <SummaryBox label="Ditandai" value={counts.marked} colorClass="text-amber-700 bg-amber-50" />
      </div>
    </div>
  )
}

function LegendDot({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-full border ${colorClass}`} />
      {label}
    </span>
  )
}

function SummaryBox({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className={`rounded-lg py-2 ${colorClass}`}>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[11px] mt-1">{label}</p>
    </div>
  )
}

export default function QuestionNavigatorModal({
  questions,
  answers,
  currentIndex,
  onSelect,
  onClose,
  urgent = false,
}: {
  questions: Question[]
  answers: AnswersMap
  currentIndex: number
  onSelect: (index: number) => void
  onClose: () => void
  urgent?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-slide"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Navigasi Soal"
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Navigasi Soal</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup navigasi"
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <QuestionNavigatorGrid
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onSelect={(idx) => {
            onSelect(idx)
            onClose()
          }}
          urgent={urgent}
        />
      </div>
    </div>
  )
}
