import type { ElementScore, ScoreSummary } from '../utils/scoring'

export function ScoreCard({ summary, participantName }: { summary: ScoreSummary; participantName: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
      <p className="text-sm text-gray-500 mb-1">Nilai Tes TKA</p>
      {summary.score !== null ? (
        <p className="text-5xl font-extrabold text-examblue">
          {summary.score}
          <span className="text-xl text-gray-400 font-semibold"> / 100</span>
        </p>
      ) : (
        <div>
          <p className="text-2xl font-bold text-gray-400">Kunci jawaban belum tersedia</p>
          <p className="text-xs text-gray-400 mt-1">
            Skor akan otomatis dihitung begitu kunci jawaban resmi ditambahkan ke data soal.
          </p>
        </div>
      )}
      <p className="text-sm text-gray-600 mt-3">
        Selamat mengerjakan, <span className="font-medium">{participantName}</span>!
      </p>

      <div className="grid grid-cols-4 gap-2 mt-5 text-sm">
        <Stat label="Soal" value={summary.total} colorClass="text-gray-700 bg-gray-50" />
        <Stat label="Terjawab" value={summary.answered} colorClass="text-examblue bg-examblue-light" />
        <Stat label="Benar" value={summary.gradedCount > 0 ? summary.correct : '—'} colorClass="text-green-700 bg-green-50" />
        <Stat label="Salah" value={summary.gradedCount > 0 ? summary.wrong : '—'} colorClass="text-red-700 bg-red-50" />
      </div>
    </div>
  )
}

function Stat({ label, value, colorClass }: { label: string; value: number | string; colorClass: string }) {
  return (
    <div className={`rounded-xl py-3 ${colorClass}`}>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[11px] mt-1.5">{label}</p>
    </div>
  )
}

export function ElementScoreList({ scores }: { scores: ElementScore[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Hasil per Elemen</h3>
      <div className="space-y-4">
        {scores.map((s) => (
          <div key={s.element}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-800">{s.element}</span>
              <span className="text-gray-500">
                {s.percentage !== null ? `${s.percentage}%` : 'belum ada kunci jawaban'}
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-examblue rounded-full transition-all"
                style={{ width: `${s.percentage ?? 0}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {s.total} soal pada elemen ini
              {s.graded > 0 ? ` · ${s.graded} soal punya kunci jawaban` : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
