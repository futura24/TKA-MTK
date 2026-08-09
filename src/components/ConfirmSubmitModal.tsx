import { AlertTriangle } from 'lucide-react'

export default function ConfirmSubmitModal({
  total,
  answered,
  unanswered,
  marked,
  onCancel,
  onConfirm,
}: {
  total: number
  answered: number
  unanswered: number
  marked: number
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-slide"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Konfirmasi selesai ujian"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="font-bold text-lg text-gray-900 mb-1">Apakah Anda yakin ingin mengakhiri tes?</h2>

        <div className="grid grid-cols-3 gap-2 my-4 text-sm">
          <div className="bg-gray-50 rounded-lg py-2">
            <p className="font-bold text-gray-800">{total}</p>
            <p className="text-[11px] text-gray-500">Total Soal</p>
          </div>
          <div className="bg-green-50 rounded-lg py-2">
            <p className="font-bold text-green-700">{answered}</p>
            <p className="text-[11px] text-gray-500">Terjawab</p>
          </div>
          <div className="bg-gray-100 rounded-lg py-2">
            <p className="font-bold text-gray-700">{unanswered}</p>
            <p className="text-[11px] text-gray-500">Belum Dijawab</p>
          </div>
        </div>

        {unanswered > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-2">
            Terdapat {unanswered} soal yang belum dijawab.
          </p>
        )}
        {marked > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-2">
            Terdapat {marked} soal yang ditandai untuk ditinjau.
          </p>
        )}

        <p className="text-xs text-gray-500 mb-5">
          Soal yang telah dikumpulkan tidak dapat diubah.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-examblue hover:bg-examblue-dark text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            Ya, Kumpulkan
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors"
          >
            Kembali ke Soal
          </button>
        </div>
      </div>
    </div>
  )
}
