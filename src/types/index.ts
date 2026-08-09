// ============================================================
// TIPE DATA SOAL
// ============================================================

export type QuestionType =
  | 'single-choice'      // radio, satu jawaban benar
  | 'multiple-choice'    // checkbox, jawaban benar > 1
  | 'true-false'         // tabel pernyataan Benar/Salah
  | 'matching'           // dropdown / mencocokkan
  | 'numeric'            // input angka
  | 'short-answer'       // input teks singkat

export interface QuestionOption {
  id: string
  text: string // boleh berisi $...$ untuk inline math atau $$...$$ untuk block math
  image?: string
}

// Untuk soal true-false: setiap baris adalah satu pernyataan yang harus
// dinilai Benar/Salah (atau label kustom, mis. "Mungkin" / "Tidak Mungkin",
// "Fungsi" / "Bukan Fungsi", "Bisa ditanami" / "Tidak bisa ditanami").
export interface TrueFalseStatement {
  id: string
  text: string
  image?: string
}

export interface AdminData {
  difficulty?: 'easy' | 'medium' | 'hard'
  cognitiveLevel?: string
}

export interface Question {
  id: number
  number: number
  code: string
  element: string
  subelement: string
  competency: string
  indicator: string
  stimulusId: string | null
  type: QuestionType
  question: string // teks soal, boleh mengandung $...$ / $$...$$
  image?: string
  images?: string[]
  table?: { headers: string[]; rows: string[][] }
  options?: QuestionOption[]
  // Untuk true-false / matching: daftar pernyataan + label kolom
  statements?: TrueFalseStatement[]
  trueFalseLabels?: [string, string] // contoh: ["Benar", "Salah"]
  // Kunci jawaban - TIDAK diisi bila belum tersedia di sumber (lihat catatan proyek)
  answerKey: string | string[] | Record<string, string> | null
  explanation: string | null
  adminData?: AdminData
}

export interface Stimulus {
  id: string
  title: string
  content: string
  image?: string
  images?: string[]
}

// ============================================================
// TIPE STATE UJIAN
// ============================================================

export interface ParticipantIdentity {
  name: string
  studentId: string
  school: string
  className: string
}

export interface AnswerRecord {
  questionId: number
  answer: string | string[] | Record<string, string> | null
  answered: boolean
  marked: boolean
}

export type AnswersMap = Record<number, AnswerRecord>

export interface ExamTiming {
  startTime: number // epoch ms
  endTime: number   // epoch ms
}

export interface ExamConfig {
  year: number
  title: string
  subtitle: string
  subject: string
  level: string
  totalQuestions: number
  durationSeconds: number
}
