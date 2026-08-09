import type { AnswersMap, Question } from '../types'

export type QuestionStatus = 'unanswered' | 'answered' | 'marked'

export function getQuestionStatus(answers: AnswersMap, questionId: number): QuestionStatus {
  const rec = answers[questionId]
  if (!rec) return 'unanswered'
  if (rec.marked) return 'marked'
  if (rec.answered) return 'answered'
  return 'unanswered'
}

export function isAnswerEmpty(answer: AnswersMap[number]['answer']): boolean {
  if (answer === null || answer === undefined) return true
  if (Array.isArray(answer)) return answer.length === 0
  if (typeof answer === 'object') return Object.keys(answer).length === 0
  return answer === ''
}

export function countByStatus(answers: AnswersMap, questions: Question[]) {
  let answered = 0
  let unanswered = 0
  let marked = 0
  for (const q of questions) {
    const status = getQuestionStatus(answers, q.id)
    if (status === 'answered') answered++
    else if (status === 'marked') marked++
    else unanswered++
  }
  return { answered, unanswered, marked, total: questions.length }
}

export function initAnswersMap(questions: Question[]): AnswersMap {
  const map: AnswersMap = {}
  for (const q of questions) {
    map[q.id] = { questionId: q.id, answer: null, answered: false, marked: false }
  }
  return map
}
