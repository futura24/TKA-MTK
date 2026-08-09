import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useExam } from '../hooks/useExam'
import type { ParticipantIdentity } from '../types'

export default function Identity() {
  const navigate = useNavigate()
  const { identity, setIdentity } = useExam()
  const [form, setForm] = useState<ParticipantIdentity>(
    identity ?? { name: '', studentId: '', school: '', className: '' }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ParticipantIdentity, string>>>({})

  function update(field: keyof ParticipantIdentity, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!form.name.trim()) nextErrors.name = 'Nama wajib diisi'
    if (!form.school.trim()) nextErrors.school = 'Asal sekolah wajib diisi'
    if (!form.className.trim()) nextErrors.className = 'Kelas wajib diisi'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIdentity(form)
    navigate('/petunjuk')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Identitas Peserta</h1>
        <p className="text-sm text-gray-500 mb-6">
          Isi data diri Anda sebelum memulai Tes TKA.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            label="Nama Peserta"
            required
            value={form.name}
            onChange={(v) => update('name', v)}
            error={errors.name}
            placeholder="Nama lengkap"
          />
          <Field
            label="NIS/NISN"
            value={form.studentId}
            onChange={(v) => update('studentId', v)}
            placeholder="Nomor induk siswa (opsional)"
          />
          <Field
            label="Asal Sekolah"
            required
            value={form.school}
            onChange={(v) => update('school', v)}
            error={errors.school}
            placeholder="Nama sekolah"
          />
          <Field
            label="Kelas"
            required
            value={form.className}
            onChange={(v) => update('className', v)}
            error={errors.className}
            placeholder="Contoh: 9A"
          />

          <button
            type="submit"
            className="w-full bg-examblue hover:bg-examblue-dark text-white font-semibold py-3 rounded-xl mt-2 transition-colors"
          >
            LANJUTKAN
          </button>
        </form>
      </main>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-examblue/40 focus:border-examblue transition-colors
          ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
