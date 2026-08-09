import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useExam } from '../hooks/useExam'
import { examConfig } from '../data/examConfig'

const steps = [
  'Bacalah setiap soal dengan teliti.',
  'Pilih jawaban yang paling tepat.',
  'Beberapa soal dapat memiliki lebih dari satu jawaban benar.',
  'Gunakan tombol "Tandai" jika ingin meninjau soal kembali.',
  'Jawaban tersimpan secara otomatis.',
  'Pastikan seluruh soal telah diperiksa sebelum mengakhiri tes.',
  'Setelah ujian dikumpulkan, jawaban tidak dapat diubah.',
]

export default function Instructions() {
  const navigate = useNavigate()
  const { identity, startExam } = useExam()

  useEffect(() => {
    if (!identity) navigate('/identitas')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity])

  if (!identity) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <h1 className="text-lg font-bold text-gray-900 mb-4">Petunjuk Pengerjaan</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <ol className="space-y-2.5 list-decimal list-inside text-sm text-gray-700">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="bg-examblue-light/60 border border-examblue/20 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-examblue-dark mb-3">Legenda status soal</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-gray-700">
            <LegendItem colorClass="bg-gray-200 border-gray-300" label="Belum dijawab" />
            <LegendItem colorClass="bg-green-100 border-green-300" label="Sudah dijawab" />
            <LegendItem colorClass="bg-amber-100 border-amber-300" label="Ditandai" />
            <LegendItem colorClass="bg-examblue border-examblue" label="Soal aktif" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Peserta:</span> {identity.name} ·{' '}
            {identity.school} · {identity.className}
          </p>
          <p className="mt-1">
            <span className="font-medium text-gray-800">Jumlah soal:</span> {examConfig.totalQuestions} ·{' '}
            <span className="font-medium text-gray-800">Waktu:</span>{' '}
            {Math.round(examConfig.durationSeconds / 60)} menit
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            startExam()
            navigate('/ujian')
          }}
          className="w-full bg-examblue hover:bg-examblue-dark text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          SAYA MENGERTI, MULAI TES TKA
        </button>
      </main>
    </div>
  )
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`w-3.5 h-3.5 rounded-full border ${colorClass}`} />
      {label}
    </span>
  )
}
