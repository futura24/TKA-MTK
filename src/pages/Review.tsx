import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, XCircle } from 'lucide-react'
import Header from '../components/Header'
import { useExam } from '../hooks/useExam'
import { questions } from '../data/questions'
import { gradeQuestion } from '../utils/scoring'
import MathText from '../components/MathText'
import { ZoomableImage } from '../components/ImageViewer'
import ImageLightbox from '../components/ImageViewer'
import type { Question } from '../types'

const elementFilters = ['Semua', 'Bilangan', 'Aljabar', 'Geometri dan Pengukuran', 'Data dan Peluang']

function formatAnswer(question: Question, answer: unknown): string {
  if (answer === null || answer === undefined) return '-'
  if (question.type === 'single-choice' && typeof answer === 'string') {
    const opt = question.options?.find((o) => o.id === answer)
    return opt ? `${answer}${opt.text ? ' - ' + opt.text.replace(/\$/g, '') : ''}` : answer
  }
  if (question.type === 'multiple-choice' && Array.isArray(answer)) {
    return answer.length > 0 ? answer.join(', ') : '-'
  }
  if (question.type === 'true-false' && typeof answer === 'object' && !Array.isArray(answer)) {
    const entries = Object.entries(answer as Record<string, string>)
    if (entries.length === 0) return '-'
    return entries
      .map(([stId, label]) => {
        const st = question.statements?.find((s) => s.id === stId)
        return `${st?.text ?? stId}: ${label}`
      })
      .join(' · ')
  }
  return String(answer)
}

export default function Review() {
  const navigate = useNavigate()
  const { identity, answers, submitted } = useExam()
  const [filter, setFilter] = useState('Semua')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!identity) navigate('/')
    else if (!submitted) navigate('/ujian')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, submitted])

  const filtered = useMemo(
    () => questions.filter((q) => filter === 'Semua' || q.element === filter),
    [filter]
  )

  if (!identity || !submitted) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-lg font-bold text-gray-900 mb-3">Review Jawaban</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {elementFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-examblue text-white border-examblue'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'Geometri dan Pengukuran' ? 'Geometri & Pengukuran' : f === 'Data dan Peluang' ? 'Data & Peluang' : f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((q) => {
            const record = answers[q.id]
            const correctness = gradeQuestion(q, record)
            return (
              <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-gray-900 text-sm">
                    Soal Nomor {q.number}{' '}
                    <span className="text-xs font-normal text-gray-400">
                      · {q.element} / {q.subelement}
                    </span>
                  </h2>
                  <StatusBadge correctness={correctness} />
                </div>

                <MathText text={q.question} className="text-sm text-gray-700 mb-2" />

                {q.image && (
                  <div className="mb-2">
                    <ZoomableImage
                      src={q.image}
                      alt={`Ilustrasi soal ${q.number}`}
                      onOpen={(src, alt) => setLightbox({ src, alt })}
                      className="max-w-[220px]"
                    />
                  </div>
                )}

                <div className="text-sm bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-gray-500 text-xs mb-1">Jawaban Anda</p>
                  <p className="text-gray-800 font-medium whitespace-pre-line">
                    {formatAnswer(q, record?.answer)}
                  </p>
                </div>

                <div className="text-sm bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-gray-500 text-xs mb-1">Pembahasan</p>
                  <p className="text-gray-600">
                    {q.explanation ? q.explanation : 'Pembahasan belum tersedia.'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('/hasil')}
          className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
        >
          Kembali ke Hasil
        </button>
      </main>

      <ImageLightbox src={lightbox?.src ?? null} alt={lightbox?.alt ?? ''} onClose={() => setLightbox(null)} />
    </div>
  )
}

function StatusBadge({ correctness }: { correctness: ReturnType<typeof gradeQuestion> }) {
  if (correctness === 'correct')
    return (
      <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> Benar
      </span>
    )
  if (correctness === 'incorrect')
    return (
      <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
        <XCircle className="w-3.5 h-3.5" /> Salah
      </span>
    )
  if (correctness === 'unanswered')
    return (
      <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        <Circle className="w-3.5 h-3.5" /> Tidak dijawab
      </span>
    )
  return (
    <span className="shrink-0 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
      Belum ada kunci
    </span>
  )
}
