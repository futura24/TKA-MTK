import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AnswerRecord, AnswersMap, ExamTiming, ParticipantIdentity } from '../types'
import { questions } from '../data/questions'
import { examConfig } from '../data/examConfig'
import { useLocalStorage } from './useLocalStorage'
import { initAnswersMap } from '../utils/questionUtils'

const KEY_IDENTITY = 'tka_simulation_identity'
const KEY_ANSWERS = 'tka_simulation_answers'
const KEY_TIMING = 'tka_simulation_timing'
const KEY_CURRENT = 'tka_simulation_current_index'
const KEY_SUBMITTED = 'tka_simulation_submitted'
const KEY_SUBMITTED_AT = 'tka_simulation_submitted_at'

interface ExamContextValue {
  identity: ParticipantIdentity | null
  setIdentity: (identity: ParticipantIdentity) => void

  answers: AnswersMap
  setAnswer: (questionId: number, answer: AnswerRecord['answer']) => void
  toggleMark: (questionId: number) => void

  currentIndex: number
  goToIndex: (index: number) => void
  goNext: () => void
  goPrev: () => void

  timing: ExamTiming | null
  startExam: () => void

  submitted: boolean
  submittedAt: number | null
  submitExam: () => void

  resetSimulation: () => void
}

const ExamContext = createContext<ExamContextValue | null>(null)

export function ExamProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useLocalStorage<ParticipantIdentity | null>(
    KEY_IDENTITY,
    null
  )
  const [answers, setAnswers] = useLocalStorage<AnswersMap>(KEY_ANSWERS, initAnswersMap(questions))
  const [timing, setTiming] = useLocalStorage<ExamTiming | null>(KEY_TIMING, null)
  const [currentIndex, setCurrentIndex] = useLocalStorage<number>(KEY_CURRENT, 0)
  const [submitted, setSubmitted] = useLocalStorage<boolean>(KEY_SUBMITTED, false)
  const [submittedAt, setSubmittedAt] = useLocalStorage<number | null>(KEY_SUBMITTED_AT, null)

  const setIdentity = useCallback(
    (id: ParticipantIdentity) => setIdentityState(id),
    [setIdentityState]
  )

  const setAnswer = useCallback(
    (questionId: number, answer: AnswerRecord['answer']) => {
      setAnswers((prev) => {
        const prevRec = prev[questionId] || { questionId, answer: null, answered: false, marked: false }
        const isEmpty =
          answer === null ||
          (Array.isArray(answer) && answer.length === 0) ||
          (typeof answer === 'object' && answer !== null && !Array.isArray(answer) && Object.keys(answer).length === 0) ||
          answer === ''
        return {
          ...prev,
          [questionId]: { ...prevRec, answer, answered: !isEmpty },
        }
      })
    },
    [setAnswers]
  )

  const toggleMark = useCallback(
    (questionId: number) => {
      setAnswers((prev) => {
        const prevRec = prev[questionId] || { questionId, answer: null, answered: false, marked: false }
        return { ...prev, [questionId]: { ...prevRec, marked: !prevRec.marked } }
      })
    },
    [setAnswers]
  )

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), questions.length - 1)
      setCurrentIndex(clamped)
    },
    [setCurrentIndex]
  )
  const goNext = useCallback(() => goToIndex(currentIndex + 1), [currentIndex, goToIndex])
  const goPrev = useCallback(() => goToIndex(currentIndex - 1), [currentIndex, goToIndex])

  const startExam = useCallback(() => {
    const now = Date.now()
    setTiming({ startTime: now, endTime: now + examConfig.durationSeconds * 1000 })
    setSubmitted(false)
    setSubmittedAt(null)
    setCurrentIndex(0)
  }, [setTiming, setSubmitted, setSubmittedAt, setCurrentIndex])

  const submitExam = useCallback(() => {
    setSubmitted(true)
    setSubmittedAt(Date.now())
  }, [setSubmitted, setSubmittedAt])

  const resetSimulation = useCallback(() => {
    setIdentityState(null)
    setAnswers(initAnswersMap(questions))
    setTiming(null)
    setCurrentIndex(0)
    setSubmitted(false)
    setSubmittedAt(null)
  }, [setIdentityState, setAnswers, setTiming, setCurrentIndex, setSubmitted, setSubmittedAt])

  const value = useMemo<ExamContextValue>(
    () => ({
      identity,
      setIdentity,
      answers,
      setAnswer,
      toggleMark,
      currentIndex,
      goToIndex,
      goNext,
      goPrev,
      timing,
      startExam,
      submitted,
      submittedAt,
      submitExam,
      resetSimulation,
    }),
    [
      identity,
      setIdentity,
      answers,
      setAnswer,
      toggleMark,
      currentIndex,
      goToIndex,
      goNext,
      goPrev,
      timing,
      startExam,
      submitted,
      submittedAt,
      submitExam,
      resetSimulation,
    ]
  )

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}

export function useExam() {
  const ctx = useContext(ExamContext)
  if (!ctx) throw new Error('useExam harus dipakai di dalam <ExamProvider>')
  return ctx
}
