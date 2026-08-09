import type { ExamConfig } from '../types'

// Ganti isi objek ini (atau buat examConfig-2026.ts baru dan ubah import
// di examConfig.ts) untuk beralih ke paket soal tahun berikutnya tanpa
// menyentuh kode komponen UI sama sekali.
export const examConfig: ExamConfig = {
  year: 2026,
  title: 'TKA MATEMATIKA SMP',
  subtitle: 'Asesmen Matematika Tingkat SMP',
  subject: 'Matematika',
  level: 'SMP',
  totalQuestions: 30,
  durationSeconds: 90 * 60, // 90 menit, sesuaikan bila perlu
}
