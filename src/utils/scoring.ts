import type { AnswersMap, Question } from '../types'
import { isAnswerEmpty } from './questionUtils'

export type QuestionCorrectness = 'correct' | 'incorrect' | 'ungraded' | 'unanswered'

/**
 * Menilai satu soal. Mengembalikan 'ungraded' jika kunci jawaban belum
 * tersedia di data (answerKey === null) - lihat catatan di data/questions.ts.
 * Logika penilaian dipisah per tipe soal sesuai spesifikasi proyek:
 *  - single-choice   : benar jika answer === answerKey
 *  - multiple-choice : benar jika seluruh pilihan sesuai answerKey (set sama persis)
 *  - true-false/matching (Record<string,string>): benar jika seluruh pasangan sesuai
 */
export function gradeQuestion(question: Question, record?: AnswersMap[number]): QuestionCorrectness {
  if (question.answerKey === null) return 'ungraded'
  if (!record || isAnswerEmpty(record.answer)) return 'unanswered'

  const { type, answerKey } = question
  const answer = record.answer

  if (type === 'single-choice' || type === 'numeric' || type === 'short-answer') {
    if (typeof answer !== 'string' || typeof answerKey !== 'string') return 'ungraded'
    return answer.trim().toLowerCase() === answerKey.trim().toLowerCase() ? 'correct' : 'incorrect'
  }

  if (type === 'multiple-choice') {
    if (!Array.isArray(answer) || !Array.isArray(answerKey)) return 'ungraded'
    const a = [...answer].sort()
    const b = [...answerKey].sort()
    const same = a.length === b.length && a.every((v, i) => v === b[i])
    return same ? 'correct' : 'incorrect'
  }

  if (type === 'true-false' || type === 'matching') {
    if (typeof answer !== 'object' || Array.isArray(answer)) return 'ungraded'
    if (typeof answerKey !== 'object' || Array.isArray(answerKey)) return 'ungraded'
    const keys = Object.keys(answerKey)
    if (keys.length === 0) return 'ungraded'
    const allMatch = keys.every((k) => (answer as Record<string, string>)[k] === answerKey[k])
    return allMatch ? 'correct' : 'incorrect'
  }

  return 'ungraded'
}

export function calculateCorrectAnswers(questions: Question[], answers: AnswersMap): number {
  return questions.filter((q) => gradeQuestion(q, answers[q.id]) === 'correct').length
}

export function calculateWrongAnswers(questions: Question[], answers: AnswersMap): number {
  return questions.filter((q) => gradeQuestion(q, answers[q.id]) === 'incorrect').length
}

export function calculateUnanswered(questions: Question[], answers: AnswersMap): number {
  return questions.filter((q) => isAnswerEmpty(answers[q.id]?.answer)).length
}

export function hasAnyAnswerKey(questions: Question[]): boolean {
  return questions.some((q) => q.answerKey !== null)
}

export interface ElementScore {
  element: string
  correct: number
  graded: number // soal pada elemen ini yang punya kunci jawaban
  total: number // total soal pada elemen ini
  percentage: number | null // null jika tidak ada soal yang bisa dinilai
}

export function calculateElementScores(questions: Question[], answers: AnswersMap): ElementScore[] {
  const elements = Array.from(new Set(questions.map((q) => q.element)))
  return elements.map((element) => {
    const qs = questions.filter((q) => q.element === element)
    const graded = qs.filter((q) => q.answerKey !== null)
    const correct = qs.filter((q) => gradeQuestion(q, answers[q.id]) === 'correct').length
    return {
      element,
      correct,
      graded: graded.length,
      total: qs.length,
      percentage: graded.length > 0 ? Math.round((correct / graded.length) * 100) : null,
    }
  })
}

export interface ScoreSummary {
  total: number
  answered: number
  unanswered: number
  correct: number
  wrong: number
  gradedCount: number
  score: number | null // skala 0-100, null jika tidak ada soal yang bisa dinilai
}

export function calculateScore(questions: Question[], answers: AnswersMap): ScoreSummary {
  const total = questions.length
  const unanswered = calculateUnanswered(questions, answers)
  const answered = total - unanswered
  const correct = calculateCorrectAnswers(questions, answers)
  const wrong = calculateWrongAnswers(questions, answers)
  const gradedCount = questions.filter((q) => q.answerKey !== null).length
  const score = gradedCount > 0 ? Math.round((correct / gradedCount) * 100) : null
  return { total, answered, unanswered, correct, wrong, gradedCount, score }
}
