import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

import type {
  AnswerRecord,
  AnswersMap,
  ExamTiming,
  ParticipantIdentity,
} from '../types'

import { questions } from '../data/questions'
import { examConfig } from '../data/examConfig'
import { useLocalStorage } from './useLocalStorage'
import { initAnswersMap } from '../utils/questionUtils'
import { supabase } from '../lib/supabase'

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const KEY_IDENTITY = 'tka_simulation_identity'
const KEY_ANSWERS = 'tka_simulation_answers'
const KEY_TIMING = 'tka_simulation_timing'
const KEY_CURRENT = 'tka_simulation_current_index'
const KEY_SUBMITTED = 'tka_simulation_submitted'
const KEY_SUBMITTED_AT = 'tka_simulation_submitted_at'
const KEY_ATTEMPT_ID = 'tka_simulation_attempt_id'

// ============================================================
// CONSTANT
// ============================================================

const TOTAL_QUESTIONS = questions.length

// ============================================================
// TYPES
// ============================================================

interface ExamContextValue {
  identity: ParticipantIdentity | null
  setIdentity: (identity: ParticipantIdentity) => void

  answers: AnswersMap

  setAnswer: (
    questionId: number,
    answer: AnswerRecord['answer']
  ) => void

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

  attemptId: string | null

  resetSimulation: () => void
}

// ============================================================
// CONTEXT
// ============================================================

const ExamContext = createContext<ExamContextValue | null>(null)

// ============================================================
// HELPER
// ============================================================

function normalizeString(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function normalizeArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => normalizeString(item))
    .sort()
}

function normalizeObject(
  value: unknown
): Record<string, string> {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return {}
  }

  const result: Record<string, string> = {}

  Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, val]) => {
      result[key] = normalizeString(val)
    })

  return result
}

function answersEqual(
  userAnswer: AnswerRecord['answer'],
  answerKey:
    | string
    | string[]
    | Record<string, string>
    | null
): boolean {
  if (answerKey === null) {
    return false
  }

  // ----------------------------------------------------------
  // STRING
  // ----------------------------------------------------------

  if (typeof answerKey === 'string') {
    if (typeof userAnswer === 'string') {
      return (
        normalizeString(userAnswer) ===
        normalizeString(answerKey)
      )
    }

    return false
  }

  // ----------------------------------------------------------
  // ARRAY
  // ----------------------------------------------------------

  if (Array.isArray(answerKey)) {
    if (!Array.isArray(userAnswer)) {
      return false
    }

    const expected = normalizeArray(answerKey)
    const actual = normalizeArray(userAnswer)

    if (expected.length !== actual.length) {
      return false
    }

    return expected.every(
      (value, index) => value === actual[index]
    )
  }

  // ----------------------------------------------------------
  // OBJECT
  // ----------------------------------------------------------

  if (
    typeof answerKey === 'object' &&
    answerKey !== null
  ) {
    if (
      typeof userAnswer !== 'object' ||
      userAnswer === null ||
      Array.isArray(userAnswer)
    ) {
      return false
    }

    const expected = normalizeObject(answerKey)
    const actual = normalizeObject(userAnswer)

    const expectedKeys = Object.keys(expected)
    const actualKeys = Object.keys(actual)

    if (expectedKeys.length !== actualKeys.length) {
      return false
    }

    return expectedKeys.every(
      (key) => expected[key] === actual[key]
    )
  }

  return false
}

// ============================================================
// PROVIDER
// ============================================================

export function ExamProvider({
  children,
}: {
  children: ReactNode
}) {
  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [identity, setIdentityState] =
    useLocalStorage<ParticipantIdentity | null>(
      KEY_IDENTITY,
      null
    )

  const [answers, setAnswers] =
    useLocalStorage<AnswersMap>(
      KEY_ANSWERS,
      initAnswersMap(questions)
    )

  const [timing, setTiming] =
    useLocalStorage<ExamTiming | null>(
      KEY_TIMING,
      null
    )

  const [currentIndex, setCurrentIndex] =
    useLocalStorage<number>(
      KEY_CURRENT,
      0
    )

  const [submitted, setSubmitted] =
    useLocalStorage<boolean>(
      KEY_SUBMITTED,
      false
    )

  const [submittedAt, setSubmittedAt] =
    useLocalStorage<number | null>(
      KEY_SUBMITTED_AT,
      null
    )

  const [attemptId, setAttemptId] =
    useLocalStorage<string | null>(
      KEY_ATTEMPT_ID,
      null
    )

  // Mencegah pembuatan attempt ganda
  const creatingAttemptRef =
    useRef(false)

  // Mencegah submit ganda
  const submittingRef =
    useRef(false)

  // ==========================================================
  // IDENTITAS
  // ==========================================================

  const setIdentity = useCallback(
    (value: ParticipantIdentity) => {
      setIdentityState(value)
    },
    [setIdentityState]
  )

  // ==========================================================
  // CEK JAWABAN KOSONG
  // ==========================================================

  const isAnswerEmpty = useCallback(
    (
      answer: AnswerRecord['answer']
    ): boolean => {
      if (answer === null) {
        return true
      }

      if (answer === '') {
        return true
      }

      if (
        Array.isArray(answer) &&
        answer.length === 0
      ) {
        return true
      }

      if (
        typeof answer === 'object' &&
        answer !== null &&
        !Array.isArray(answer) &&
        Object.keys(answer).length === 0
      ) {
        return true
      }

      return false
    },
    []
  )

  // ==========================================================
  // CARI UUID QUESTION
  // ==========================================================

  const getSupabaseQuestionId = useCallback(
    async (
      questionNumber: number
    ): Promise<string | null> => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from('questions_public')
          .select('id')
          .eq(
            'question_number',
            questionNumber
          )
          .maybeSingle()

        if (error) {
          console.error(
            `Gagal mencari UUID soal ${questionNumber}:`,
            error
          )

          return null
        }

        if (!data?.id) {
          console.error(
            `Soal nomor ${questionNumber} tidak ditemukan di questions_public.`
          )

          return null
        }

        return String(data.id)
      } catch (error) {
        console.error(
          `Error question ${questionNumber}:`,
          error
        )

        return null
      }
    },
    []
  )

  // ==========================================================
  // CEK KUNCI JAWABAN LOKAL
  // ==========================================================

  const getLocalQuestion = useCallback(
    (questionId: number) => {
      return questions.find(
        (question) =>
          question.id === questionId ||
          question.number === questionId
      )
    },
    []
  )

  // ==========================================================
  // SIMPAN JAWABAN KE SUPABASE
  // ==========================================================

  const saveAnswerToSupabase = useCallback(
    async (
      currentAttemptId: string,
      questionId: number,
      answer: AnswerRecord['answer']
    ): Promise<boolean> => {
      try {
        const question =
          getLocalQuestion(questionId)

        if (!question) {
          console.error(
            `Question lokal ${questionId} tidak ditemukan.`
          )

          return false
        }

        const supabaseQuestionId =
          await getSupabaseQuestionId(
            question.number
          )

        if (!supabaseQuestionId) {
          return false
        }

        const empty =
          isAnswerEmpty(answer)

        // ======================================================
        // HITUNG BENAR / SALAH
        // ======================================================

        const isCorrect =
          !empty &&
          answersEqual(
            answer,
            question.answerKey
          )

        // ======================================================
        // SIMPAN ANSWER SEBAGAI TEXT
        //
        // Kolom answers.answer = TEXT
        // ======================================================

        const answerText =
          empty
            ? null
            : typeof answer === 'string'
              ? answer
              : JSON.stringify(answer)

        // ======================================================
        // CARI RECORD LAMA
        // ======================================================

        const {
          data: existing,
          error: findError,
        } = await supabase
          .from('answers')
          .select('id')
          .eq(
            'attempt_id',
            currentAttemptId
          )
          .eq(
            'question_id',
            supabaseQuestionId
          )
          .limit(1)
          .maybeSingle()

        if (findError) {
          console.error(
            `Gagal mencari answer ${questionId}:`,
            findError
          )

          return false
        }

        // ======================================================
        // UPDATE
        // ======================================================

        if (existing?.id) {
          const {
            error: updateError,
          } = await supabase
            .from('answers')
            .update({
              answer: answerText,
              is_correct: empty
                ? null
                : isCorrect,
              answered_at: new Date().toISOString(),
            })
            .eq(
              'id',
              existing.id
            )

          if (updateError) {
            console.error(
              `Gagal update answer ${questionId}:`,
              updateError
            )

            return false
          }

          return true
        }

        // ======================================================
        // INSERT
        // ======================================================

        const {
          error: insertError,
        } = await supabase
          .from('answers')
          .insert({
            attempt_id:
              currentAttemptId,

            question_id:
              supabaseQuestionId,

            answer:
              answerText,

            is_correct:
              empty
                ? null
                : isCorrect,

            answered_at:
              new Date().toISOString(),
          })

        if (insertError) {
          console.error(
            `Gagal insert answer ${questionId}:`,
            insertError
          )

          return false
        }

        return true
      } catch (error) {
        console.error(
          `saveAnswerToSupabase(${questionId}) error:`,
          error
        )

        return false
      }
    },
    [
      getLocalQuestion,
      getSupabaseQuestionId,
      isAnswerEmpty,
    ]
  )

  // ==========================================================
  // HITUNG STATISTIK ATTEMPT
  // ==========================================================

  const updateAttemptStatistics =
    useCallback(
      async (
        currentAttemptId: string
      ) => {
        try {
          const {
            data: answerRows,
            error,
          } = await supabase
            .from('answers')
            .select(
              'answer, is_correct'
            )
            .eq(
              'attempt_id',
              currentAttemptId
            )

          if (error) {
            console.error(
              'Gagal mengambil statistik answers:',
              error
            )

            return
          }

          const answeredCount =
            answerRows?.filter(
              (row) =>
                row.answer !== null &&
                row.answer !== ''
            ).length ?? 0

          const correctCount =
            answerRows?.filter(
              (row) =>
                row.is_correct === true
            ).length ?? 0

          const wrongCount =
            answerRows?.filter(
              (row) =>
                row.is_correct === false
            ).length ?? 0

          const score =
            TOTAL_QUESTIONS > 0
              ? Number(
                  (
                    (correctCount /
                      TOTAL_QUESTIONS) *
                    100
                  ).toFixed(2)
                )
              : 0

          const {
            error: updateError,
          } = await supabase
            .from('attempts')
            .update({
              total_questions:
                TOTAL_QUESTIONS,

              answered_count:
                answeredCount,

              correct_count:
                correctCount,

              wrong_count:
                wrongCount,

              score,
            })
            .eq(
              'id',
              currentAttemptId
            )

          if (updateError) {
            console.error(
              'Gagal update statistik attempt:',
              updateError
            )

            return
          }

          console.log(
            'Statistik attempt diperbarui:',
            {
              totalQuestions:
                TOTAL_QUESTIONS,
              answeredCount,
              correctCount,
              wrongCount,
              score,
            }
          )
        } catch (error) {
          console.error(
            'updateAttemptStatistics error:',
            error
          )
        }
      },
      []
    )

  // ==========================================================
  // SET ANSWER
  // ==========================================================

  const setAnswer = useCallback(
    (
      questionId: number,
      answer: AnswerRecord['answer']
    ) => {
      const empty =
        isAnswerEmpty(answer)

      // --------------------------------------------------------
      // LOCAL STORAGE
      // --------------------------------------------------------

      setAnswers((previous) => {
        const previousRecord =
          previous[questionId] ?? {
            questionId,
            answer: null,
            answered: false,
            marked: false,
          }

        return {
          ...previous,

          [questionId]: {
            ...previousRecord,

            answer,

            answered: !empty,
          },
        }
      })

      // --------------------------------------------------------
      // SUPABASE
      // --------------------------------------------------------

      if (
        attemptId &&
        !submitted
      ) {
        void saveAnswerToSupabase(
          attemptId,
          questionId,
          answer
        ).then(() => {
          void updateAttemptStatistics(
            attemptId
          )
        })
      }
    },
    [
      attemptId,
      submitted,
      setAnswers,
      isAnswerEmpty,
      saveAnswerToSupabase,
      updateAttemptStatistics,
    ]
  )

  // ==========================================================
  // SINKRONISASI LOCAL → SUPABASE
  // ==========================================================

  useEffect(() => {
    if (!attemptId) {
      return
    }

    if (submitted) {
      return
    }

    let cancelled = false

    const syncAnswers =
      async () => {
        const answered =
          Object.values(
            answers
          ).filter(
            (record) =>
              !isAnswerEmpty(
                record.answer
              )
          )

        if (
          answered.length === 0
        ) {
          return
        }

        console.log(
          `Sinkronisasi ${answered.length} jawaban...`
        )

        for (
          const record of answered
        ) {
          if (cancelled) {
            return
          }

          await saveAnswerToSupabase(
            attemptId,
            record.questionId,
            record.answer
          )
        }

        if (!cancelled) {
          await updateAttemptStatistics(
            attemptId
          )
        }

        console.log(
          'Sinkronisasi jawaban selesai.'
        )
      }

    void syncAnswers()

    return () => {
      cancelled = true
    }
  }, [
    attemptId,
    submitted,
    answers,
    isAnswerEmpty,
    saveAnswerToSupabase,
    updateAttemptStatistics,
  ])

  // ==========================================================
  // TOGGLE MARK
  // ==========================================================

  const toggleMark = useCallback(
    (
      questionId: number
    ) => {
      setAnswers((previous) => {
        const previousRecord =
          previous[questionId] ?? {
            questionId,
            answer: null,
            answered: false,
            marked: false,
          }

        return {
          ...previous,

          [questionId]: {
            ...previousRecord,

            marked:
              !previousRecord.marked,
          },
        }
      })
    },
    [setAnswers]
  )

  // ==========================================================
  // NAVIGASI
  // ==========================================================

  const goToIndex = useCallback(
    (index: number) => {
      const maxIndex =
        Math.max(
          questions.length - 1,
          0
        )

      const clamped =
        Math.min(
          Math.max(index, 0),
          maxIndex
        )

      setCurrentIndex(
        clamped
      )
    },
    [setCurrentIndex]
  )

  const goNext =
    useCallback(() => {
      goToIndex(
        currentIndex + 1
      )
    }, [
      currentIndex,
      goToIndex,
    ])

  const goPrev =
    useCallback(() => {
      goToIndex(
        currentIndex - 1
      )
    }, [
      currentIndex,
      goToIndex,
    ])

  // ==========================================================
  // CARI / BUAT STUDENT
  // ==========================================================

  const getOrCreateStudent =
    useCallback(
      async (
        participant: ParticipantIdentity
      ): Promise<string | null> => {
        // ------------------------------------------------------
        // 1. Cari berdasarkan student_id
        // ------------------------------------------------------

        if (
          participant.studentId
        ) {
          const {
            data: existingStudent,
            error: findError,
          } = await supabase
            .from('students')
            .select('id')
            .eq(
              'student_id',
              participant.studentId
            )
            .limit(1)
            .maybeSingle()

          if (findError) {
            console.error(
              'Gagal mencari student:',
              findError
            )

            return null
          }

          if (
            existingStudent?.id
          ) {
            return String(
              existingStudent.id
            )
          }
        }

        // ------------------------------------------------------
        // 2. Buat student baru
        // ------------------------------------------------------

        const {
          data: newStudent,
          error: insertError,
        } = await supabase
          .from('students')
          .insert({
            name:
              participant.name,

            student_id:
              participant.studentId,

            school:
              participant.school,

            class_name:
              participant.className,
          })
          .select('id')
          .single()

        if (insertError) {
          console.error(
            'Gagal membuat student:',
            insertError
          )

          return null
        }

        if (!newStudent?.id) {
          console.error(
            'Student dibuat tetapi ID tidak tersedia.'
          )

          return null
        }

        return String(
          newStudent.id
        )
      },
      []
    )

  // ==========================================================
  // CARI EXAM
  // ==========================================================

  const getExamId =
    useCallback(
      async (): Promise<
        string | null
      > => {
        try {
          // ----------------------------------------------------
          // Prioritas 1:
          // title + active
          // ----------------------------------------------------

          const {
            data: activeExam,
            error: activeError,
          } = await supabase
            .from('exams')
            .select(
              'id, title, year, duration_minutes, is_active'
            )
            .eq(
              'title',
              examConfig.title
            )
            .eq(
              'is_active',
              true
            )
            .limit(1)
            .maybeSingle()

          if (
            activeError
          ) {
            console.error(
              'Gagal mencari exam aktif:',
              activeError
            )
          }

          if (
            activeExam?.id
          ) {
            console.log(
              'Exam ditemukan:',
              activeExam
            )

            return String(
              activeExam.id
            )
          }

          // ----------------------------------------------------
          // Prioritas 2:
          // title saja
          //
          // Digunakan jika is_active belum sesuai.
          // ----------------------------------------------------

          const {
            data: examByTitle,
            error: titleError,
          } = await supabase
            .from('exams')
            .select(
              'id, title, year, duration_minutes, is_active'
            )
            .eq(
              'title',
              examConfig.title
            )
            .order(
              'year',
              {
                ascending: false,
              }
            )
            .limit(1)
            .maybeSingle()

          if (
            titleError
          ) {
            console.error(
              'Gagal mencari exam berdasarkan title:',
              titleError
            )

            return null
          }

          if (
            examByTitle?.id
          ) {
            console.warn(
              'Exam ditemukan tetapi is_active bukan TRUE:',
              examByTitle
            )

            return String(
              examByTitle.id
            )
          }

          console.error(
            'UJIAN TIDAK DITEMUKAN.',
            {
              expectedTitle:
                examConfig.title,
            }
          )

          return null
        } catch (error) {
          console.error(
            'getExamId error:',
            error
          )

          return null
        }
      },
      []
    )

  // ==========================================================
  // BUAT ATTEMPT SUPABASE
  // ==========================================================

  const createSupabaseAttempt =
    useCallback(
      async (): Promise<
        string | null
      > => {
        if (!identity) {
          console.warn(
            'Identitas peserta belum tersedia.'
          )

          return null
        }

        if (
          creatingAttemptRef.current
        ) {
          console.warn(
            'Attempt sedang dibuat.'
          )

          return null
        }

        creatingAttemptRef.current =
          true

        try {
          console.log(
            '======================================'
          )

          console.log(
            'MEMULAI PEMBUATAN ATTEMPT SUPABASE'
          )

          console.log(
            'Identitas:',
            identity
          )

          // ----------------------------------------------------
          // STUDENT
          // ----------------------------------------------------

          const studentId =
            await getOrCreateStudent(
              identity
            )

          if (!studentId) {
            console.error(
              'Student gagal dibuat/ditemukan.'
            )

            return null
          }

          console.log(
            'Student UUID:',
            studentId
          )

          // ----------------------------------------------------
          // EXAM
          // ----------------------------------------------------

          const examId =
            await getExamId()

          if (!examId) {
            console.error(
              'Exam UUID tidak ditemukan.'
            )

            return null
          }

          console.log(
            'Exam UUID:',
            examId
          )

          // ----------------------------------------------------
          // ATTEMPT
          // ----------------------------------------------------

          const startedAt =
            new Date().toISOString()

          const {
            data: newAttempt,
            error: attemptError,
          } = await supabase
            .from('attempts')
            .insert({
              student_id:
                studentId,

              exam_id:
                examId,

              started_at:
                startedAt,

              total_questions:
                TOTAL_QUESTIONS,

              answered_count:
                0,

              correct_count:
                0,

              wrong_count:
                0,

              score:
                0,
            })
            .select('id')
            .single()

          if (
            attemptError
          ) {
            console.error(
              '======================================'
            )

            console.error(
              'GAGAL MEMBUAT ATTEMPT'
            )

            console.error(
              'code:',
              attemptError.code
            )

            console.error(
              'message:',
              attemptError.message
            )

            console.error(
              'details:',
              attemptError.details
            )

            console.error(
              'hint:',
              attemptError.hint
            )

            console.error(
              '======================================'
            )

            return null
          }

          if (
            !newAttempt?.id
          ) {
            console.error(
              'Attempt dibuat tetapi ID tidak dikembalikan.'
            )

            return null
          }

          console.log(
            'ATTEMPT BERHASIL DIBUAT:',
            newAttempt.id
          )

          return String(
            newAttempt.id
          )
        } catch (error) {
          console.error(
            'createSupabaseAttempt error:',
            error
          )

          return null
        } finally {
          creatingAttemptRef.current =
            false
        }
      },
      [
        identity,
        getOrCreateStudent,
        getExamId,
      ]
    )

  // ==========================================================
  // MULAI UJIAN
  // ==========================================================

  const startExam =
    useCallback(() => {
      // Jangan membuat attempt baru
      // jika attempt sedang aktif.
      if (
        attemptId &&
        !submitted
      ) {
        console.warn(
          'Attempt masih aktif:',
          attemptId
        )

        return
      }

      const now =
        Date.now()

      // --------------------------------------------------------
      // Reset status
      // --------------------------------------------------------

      setSubmitted(false)
      setSubmittedAt(null)
      setCurrentIndex(0)
      setAttemptId(null)

      // --------------------------------------------------------
      // Reset jawaban
      // --------------------------------------------------------

      setAnswers(
        initAnswersMap(
          questions
        )
      )

      // --------------------------------------------------------
      // Timer
      // --------------------------------------------------------

      setTiming({
        startTime:
          now,

        endTime:
          now +
          examConfig.durationSeconds *
            1000,
      })

      // --------------------------------------------------------
      // Buat attempt
      // --------------------------------------------------------

      void (async () => {
        console.log(
          'Mulai membuat attempt...'
        )

        const newAttemptId =
          await createSupabaseAttempt()

        if (
          !newAttemptId
        ) {
          console.error(
            'ATTEMPT SUPABASE GAGAL DIBUAT.'
          )

          return
        }

        setAttemptId(
          newAttemptId
        )

        console.log(
          'Attempt ID tersimpan:',
          newAttemptId
        )
      })()
    }, [
      attemptId,
      submitted,
      setSubmitted,
      setSubmittedAt,
      setCurrentIndex,
      setAttemptId,
      setAnswers,
      setTiming,
      createSupabaseAttempt,
    ])

  // ==========================================================
  // SUBMIT UJIAN
  // ==========================================================

  const submitExam =
    useCallback(() => {
      if (
        submittingRef.current
      ) {
        return
      }

      submittingRef.current =
        true

      const timestamp =
        Date.now()

      setSubmitted(true)
      setSubmittedAt(
        timestamp
      )

      if (!attemptId) {
        console.warn(
          'Tidak ada attempt_id. Submit hanya tersimpan lokal.'
        )

        submittingRef.current =
          false

        return
      }

      void (async () => {
        try {
          // ----------------------------------------------------
          // Sinkronisasi seluruh jawaban terakhir
          // ----------------------------------------------------

          const answered =
            Object.values(
              answers
            ).filter(
              (record) =>
                !isAnswerEmpty(
                  record.answer
                )
            )

          for (
            const record of answered
          ) {
            await saveAnswerToSupabase(
              attemptId,
              record.questionId,
              record.answer
            )
          }

          // ----------------------------------------------------
          // Hitung statistik
          // ----------------------------------------------------

          await updateAttemptStatistics(
            attemptId
          )

          // ----------------------------------------------------
          // Submit attempt
          // ----------------------------------------------------

          const {
            error: submitError,
          } = await supabase
            .from('attempts')
            .update({
              submitted_at:
                new Date(
                  timestamp
                ).toISOString(),
            })
            .eq(
              'id',
              attemptId
            )

          if (
            submitError
          ) {
            console.error(
              'Gagal submit attempt:',
              submitError
            )

            return
          }

          console.log(
            '======================================'
          )

          console.log(
            'ATTEMPT BERHASIL DISUBMIT'
          )

          console.log(
            'Attempt:',
            attemptId
          )

          console.log(
            '======================================'
          )
        } catch (error) {
          console.error(
            'submitExam error:',
            error
          )
        } finally {
          submittingRef.current =
            false
        }
      })()
    }, [
      attemptId,
      answers,
      isAnswerEmpty,
      saveAnswerToSupabase,
      updateAttemptStatistics,
      setSubmitted,
      setSubmittedAt,
    ])

  // ==========================================================
  // RESET SIMULASI
  // ==========================================================

  const resetSimulation =
    useCallback(() => {
      console.log(
        'Reset simulasi...'
      )

      setIdentityState(null)

      setAnswers(
        initAnswersMap(
          questions
        )
      )

      setTiming(null)

      setCurrentIndex(0)

      setSubmitted(false)

      setSubmittedAt(null)

      setAttemptId(null)

      creatingAttemptRef.current =
        false

      submittingRef.current =
        false
    }, [
      setIdentityState,
      setAnswers,
      setTiming,
      setCurrentIndex,
      setSubmitted,
      setSubmittedAt,
      setAttemptId,
    ])

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value =
    useMemo<ExamContextValue>(
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

        attemptId,

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

        attemptId,

        resetSimulation,
      ]
    )

  return (
    <ExamContext.Provider
      value={value}
    >
      {children}
    </ExamContext.Provider>
  )
}

// ============================================================
// HOOK
// ============================================================

export function useExam() {
  const context =
    useContext(
      ExamContext
    )

  if (!context) {
    throw new Error(
      'useExam harus dipakai di dalam <ExamProvider>'
    )
  }

  return context
}
