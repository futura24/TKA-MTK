import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useExam } from '../hooks/useExam'
import { questions } from '../data/questions'
import { calculateElementScores, calculateScore } from '../utils/scoring'
import { ScoreCard, ElementScoreList } from '../components/ResultCard'
import { formatDateTime } from '../utils/formatters'

export default function Result() {
  const navigate = useNavigate()
  const { identity, answers, submitted, submittedAt, resetSimulation } = useExam()

  useEffect(() => {
    if (!identity) navigate('/')
    else if (!submitted) navigate('/ujian')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, submitted])

  if (!identity || !submitted) return null

  const summary = calculateScore(questions, answers)
  const elementScores = calculateElementScores(questions, answers)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Hasil Simulasi TKA</h1>
        <p className="text-sm text-gray-500 mb-5">
          {identity.name} · {identity.school} · {identity.className}
          {submittedAt && <> · dikumpulkan {formatDateTime(submittedAt)}</>}
        </p>

        <div className="space-y-5">
          <ScoreCard summary={summary} participantName={identity.name} />
          <ElementScoreList scores={elementScores} />

          {summary.gradedCount === 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
              Kunci jawaban resmi untuk paket soal ini belum tersedia di sumber, sehingga skor
              belum dapat dihitung. Anda tetap dapat meninjau jawaban yang telah Anda isi di
              halaman Review.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate('/review')}
              className="flex-1 bg-examblue hover:bg-examblue-dark text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Lihat Review Jawaban
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset simulasi? Seluruh jawaban dan identitas akan dihapus.')) {
                  resetSimulation()
                  navigate('/')
                }
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
            >
              Reset Simulasi
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
