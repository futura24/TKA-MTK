import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { useExam } from '../hooks/useExam'
import { useTimer } from '../hooks/useTimer'
import { questions } from '../data/questions'
import { examConfig } from '../data/examConfig'
import Timer from '../components/Timer'
import QuestionCard from '../components/QuestionCard'
import ExamFooter from '../components/ExamFooter'
import QuestionNavigatorModal, { QuestionNavigatorGrid } from '../components/QuestionNavigator'
import ConfirmSubmitModal from '../components/ConfirmSubmitModal'
import ImageLightbox from '../components/ImageViewer'
import { countByStatus } from '../utils/questionUtils'

type FontSize = 'sm' | 'md' | 'lg'

export default function Exam() {
  const navigate = useNavigate()
  const { identity, answers, setAnswer, toggleMark, currentIndex, goToIndex, goNext, goPrev, timing, submitted, submitExam } =
    useExam()

  const [navigatorOpen, setNavigatorOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [fontSize, setFontSize] = useState<FontSize>('md')
  const [toast, setToast] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  const handleFinish = useCallback(() => {
    setConfirmOpen(true)
  }, [])

  const handleExpire = useCallback(() => {
    submitExam()
    navigate('/hasil')
  }, [submitExam, navigate])

  const { remainingSeconds, urgency } = useTimer(timing, handleExpire)

  useEffect(() => {
    if (!identity) {
      navigate('/identitas')
      return
    }
    if (!timing) {
      navigate('/petunjuk')
      return
    }
    if (submitted) {
      navigate('/hasil')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, timing, submitted])

  const question = questions[currentIndex]
  const record = question ? answers[question.id] : undefined
  const counts = countByStatus(answers, questions)

  // Keyboard shortcuts: ←/→ navigasi, M tandai, N navigator
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName)
      if (isTyping) return

      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key.toLowerCase() === 'm' && question) toggleMark(question.id)
      else if (e.key.toLowerCase() === 'n') setNavigatorOpen((v) => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goPrev, goNext, toggleMark, question])

  function showSavedToast() {
    setToast('Jawaban tersimpan')
    window.setTimeout(() => setToast(null), 1400)
  }

  function handleAnswerChange(answer: Parameters<typeof setAnswer>[1]) {
    if (!question) return
    setAnswer(question.id, answer)
    showSavedToast()
  }

  function handleConfirmSubmit() {
    submitExam()
    navigate('/hasil')
  }

  if (!identity || !timing || !question) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER UJIAN */}
      <header className="bg-examblue text-white sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm sm:text-base leading-tight truncate">{examConfig.title}</p>
            <p className="text-[11px] sm:text-xs text-white/80 leading-tight">
              SOAL {question.number} DARI {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Timer remainingSeconds={remainingSeconds} urgency={urgency} />
            <button
              type="button"
              onClick={() => setNavigatorOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              Navigasi Soal
            </button>
          </div>
        </div>
      </header>

      {/* AREA UTAMA */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col sm:flex-row gap-4 px-3 sm:px-4 py-4">
        <div className="flex-1 sm:w-[72%] bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-semibold text-gray-800 text-sm">Soal Nomor {question.number}</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>Ukuran teks:</span>
              <FontSizeButton active={fontSize === 'sm'} onClick={() => setFontSize('sm')} label="A" small />
              <FontSizeButton active={fontSize === 'md'} onClick={() => setFontSize('md')} label="A" />
              <FontSizeButton active={fontSize === 'lg'} onClick={() => setFontSize('lg')} label="A" large />
            </div>
          </div>

          <QuestionCard
            question={question}
            record={record}
            onAnswerChange={handleAnswerChange}
            onZoomImage={(src, alt) => setLightbox({ src, alt })}
            fontSize={fontSize}
          />
        </div>

        <aside className="hidden sm:block sm:w-[28%] bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-fit sticky top-20">
          <QuestionNavigatorGrid
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelect={goToIndex}
            urgent={urgency === 'danger'}
          />
        </aside>
      </div>

      {/* Tombol navigasi mobile mengambang */}
      <button
        type="button"
        onClick={() => setNavigatorOpen(true)}
        className="sm:hidden fixed right-4 bottom-24 z-30 bg-examblue hover:bg-examblue-dark text-white rounded-full p-3.5 shadow-lg"
        aria-label="Buka navigasi soal"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>

      <ExamFooter
        onPrev={goPrev}
        onNext={goNext}
        onMark={() => toggleMark(question.id)}
        marked={record?.marked ?? false}
        isFirst={currentIndex === 0}
        isLast={currentIndex === questions.length - 1}
        onFinish={handleFinish}
      />

      {navigatorOpen && (
        <QuestionNavigatorModal
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onSelect={goToIndex}
          onClose={() => setNavigatorOpen(false)}
          urgent={urgency === 'danger'}
        />
      )}

      {confirmOpen && (
        <ConfirmSubmitModal
          total={counts.total}
          answered={counts.answered}
          unanswered={counts.unanswered}
          marked={counts.marked}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}

      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? ''}
        onClose={() => setLightbox(null)}
      />

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-toast">
          {toast}
        </div>
      )}
    </div>
  )
}

function FontSizeButton({
  active,
  onClick,
  label,
  small,
  large,
}: {
  active: boolean
  onClick: () => void
  label: string
  small?: boolean
  large?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-1.5 rounded ${active ? 'text-examblue font-bold' : 'text-gray-400'} ${
        small ? 'text-xs' : large ? 'text-base' : 'text-sm'
      }`}
    >
      {label}
    </button>
  )
}
