import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, ClipboardList, GraduationCap, Info } from 'lucide-react'
import Header from '../components/Header'
import { examConfig } from '../data/examConfig'
import { useExam } from '../hooks/useExam'

export default function Home() {
  const navigate = useNavigate()
  const { identity, resetSimulation } = useExam()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 flex flex-col items-center text-center">
        <div className="bg-examblue-light text-examblue-dark rounded-full p-4 mb-5">
          <GraduationCap className="w-9 h-9" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {examConfig.title}
        </h1>
        <p className="text-gray-500 mt-2">{examConfig.subtitle}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-8">
          <InfoCard icon={<ClipboardList className="w-5 h-5" />} label="Jumlah Soal" value={String(examConfig.totalQuestions)} />
          <InfoCard icon={<Calculator className="w-5 h-5" />} label="Mata Pelajaran" value={examConfig.subject} />
          <InfoCard icon={<BookOpen className="w-5 h-5" />} label="Jenjang" value={examConfig.level} />
          <InfoCard icon={<Info className="w-5 h-5" />} label="Mode" value="Tes TKA" />
        </div>

        <button
          type="button"
          onClick={() => {
            resetSimulation()
            navigate('/identitas')
          }}
          className="mt-9 w-full sm:w-auto bg-examblue hover:bg-examblue-dark text-white font-semibold px-10 py-3.5 rounded-xl shadow-md shadow-examblue/20 transition-colors text-base"
        >
          MULAI TES TKA
        </button>

        {identity && (
          <button
            type="button"
            onClick={() => navigate('/ujian')}
            className="mt-3 text-sm text-examblue hover:underline"
          >
            Lanjutkan tes sebelumnya sebagai {identity.name}
          </button>
        )}

        <p className="text-xs text-gray-400 mt-6 max-w-sm">
          Kerjakan soal secara mandiri dan perhatikan waktu yang tersedia.
        </p>
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        Soal TKA Matematika SMP · Khusnul Marom · sumber: Pusmendik Kemendikdasmen
      </footer>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-1.5 shadow-sm">
      <span className="text-examblue">{icon}</span>
      <span className="font-bold text-gray-900 text-sm">{value}</span>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  )
}
