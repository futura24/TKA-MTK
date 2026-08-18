import {
  createContext,
  useCallback,
  useContext,
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
// CONTEXT TYPE
// ============================================================

interface ExamContextValue {
  identity: ParticipantIdentity | null

  setIdentity: (
    identity: ParticipantIdentity
  ) => void

  answers: AnswersMap

  setAnswer: (
    questionId: number,
    answer: AnswerRecord['answer']
  ) => void

  toggleMark: (
    questionId: number
  ) => void

  currentIndex: number

  goToIndex: (
    index: number
  ) => void

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

const ExamContext =
  createContext<ExamContextValue | null>(null)

// ============================================================
// PROVIDER
// ============================================================

export function ExamProvider({
  children,
}: {
  children: ReactNode
}) {
  // ==========================================================
  // IDENTITY
  // ==========================================================

  const [
    identity,
    setIdentityState,
  ] = useLocalStorage<ParticipantIdentity | null>(
    KEY_IDENTITY,
    null
  )

  // ==========================================================
  // ANSWERS
  // ==========================================================

  const [
    answers,
    setAnswers,
  ] = useLocalStorage<AnswersMap>(
    KEY_ANSWERS,
    initAnswersMap(questions)
  )

  // ==========================================================
  // TIMING
  // ==========================================================

  const [
    timing,
    setTiming,
  ] = useLocalStorage<ExamTiming | null>(
    KEY_TIMING,
    null
  )

  // ==========================================================
  // CURRENT QUESTION
  // ==========================================================

  const [
    currentIndex,
    setCurrentIndex,
  ] = useLocalStorage<number>(
    KEY_CURRENT,
    0
  )

  // ==========================================================
  // SUBMITTED
  // ==========================================================

  const [
    submitted,
    setSubmitted,
  ] = useLocalStorage<boolean>(
    KEY_SUBMITTED,
    false
  )

  // ==========================================================
  // SUBMITTED AT
  // ==========================================================

  const [
    submittedAt,
    setSubmittedAt,
  ] = useLocalStorage<number | null>(
    KEY_SUBMITTED_AT,
    null
  )

  // ==========================================================
  // ATTEMPT ID
  // ==========================================================

  const [
    attemptId,
    setAttemptId,
  ] = useLocalStorage<string | null>(
    KEY_ATTEMPT_ID,
    null
  )

  // ==========================================================
  // LOCK
  // ==========================================================

  const creatingAttemptRef =
    useRef(false)

  const submittingRef =
    useRef(false)

  // ==========================================================
  // SET IDENTITY
  // ==========================================================

  const setIdentity = useCallback(
    (
      value: ParticipantIdentity
    ) => {
      setIdentityState(value)
    },
    [setIdentityState]
  )

  // ==========================================================
  // CEK JAWABAN KOSONG
  // ==========================================================

  const isEmptyAnswer = useCallback(
    (
      answer: AnswerRecord['answer']
    ): boolean => {
      if (
        answer === null ||
        answer === ''
      ) {
        return true
      }

      if (
        Array.isArray(answer)
      ) {
        return answer.length === 0
      }

      if (
        typeof answer === 'object' &&
        answer !== null
      ) {
        return (
          Object.keys(answer).length === 0
        )
      }

      return false
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
      setAnswers(
        (
          previous
        ) => {
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

              answered:
                !isEmptyAnswer(answer),
            },
          }
        }
      )
    },
    [
      setAnswers,
      isEmptyAnswer,
    ]
  )

  // ==========================================================
  // TOGGLE MARK
  // ==========================================================

  const toggleMark = useCallback(
    (
      questionId: number
    ) => {
      setAnswers(
        (
          previous
        ) => {
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
        }
      )
    },
    [setAnswers]
  )

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const goToIndex = useCallback(
    (
      index: number
    ) => {
      const maxIndex =
        questions.length - 1

      const safeIndex =
        Math.min(
          Math.max(index, 0),
          maxIndex
        )

      setCurrentIndex(
        safeIndex
      )
    },
    [setCurrentIndex]
  )

  const goNext = useCallback(
    () => {
      goToIndex(
        currentIndex + 1
      )
    },
    [
      currentIndex,
      goToIndex,
    ]
  )

  const goPrev = useCallback(
    () => {
      goToIndex(
        currentIndex - 1
      )
    },
    [
      currentIndex,
      goToIndex,
    ]
  )

  // ==========================================================
  // SERIALIZE ANSWER
  // ==========================================================

  const serializeAnswer = useCallback(
    (
      answer: AnswerRecord['answer']
    ): string | null => {
      if (
        isEmptyAnswer(answer)
      ) {
        return null
      }

      if (
        typeof answer === 'string'
      ) {
        return answer
      }

      return JSON.stringify(
        answer
      )
    },
    [isEmptyAnswer]
  )

  // ==========================================================
  // COMPARE ANSWER
  // ==========================================================

  const checkAnswer = useCallback(
    (
      userAnswer: AnswerRecord['answer'],
      answerKey: unknown
    ): boolean => {
      if (
        userAnswer === null ||
        userAnswer === undefined ||
        answerKey === null ||
        answerKey === undefined
      ) {
        return false
      }

      // STRING
      if (
        typeof userAnswer === 'string' &&
        typeof answerKey === 'string'
      ) {
        return (
          userAnswer.trim() ===
          answerKey.trim()
        )
      }

      // ARRAY
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(answerKey)
      ) {
        const user =
          [...userAnswer]
            .map(String)
            .sort()

        const correct =
          [...answerKey]
            .map(String)
            .sort()

        return (
          JSON.stringify(user) ===
          JSON.stringify(correct)
        )
      }

      // OBJECT
      if (
        typeof userAnswer === 'object' &&
        userAnswer !== null &&
        typeof answerKey === 'object' &&
        answerKey !== null &&
        !Array.isArray(userAnswer) &&
        !Array.isArray(answerKey)
      ) {
        const user =
          Object.entries(userAnswer)
            .sort(
              ([a], [b]) =>
                a.localeCompare(b)
            )

        const correct =
          Object.entries(answerKey)
            .sort(
              ([a], [b]) =>
                a.localeCompare(b)
            )

        return (
          JSON.stringify(user) ===
          JSON.stringify(correct)
        )
      }

      return false
    },
    []
  )

  // ==========================================================
  // CARI STUDENT
  // ==========================================================

  const getOrCreateStudent =
    useCallback(
      async (): Promise<string | null> => {
        if (!identity) {
          console.error(
            'Identitas peserta belum tersedia.'
          )

          return null
        }

        // ------------------------------------------------------
        // CARI BERDASARKAN NIS/NISN
        // ------------------------------------------------------

        if (
          identity.studentId &&
          identity.studentId.trim() !== ''
        ) {
          const {
            data,
            error,
          } =
            await supabase
              .from('students')
              .select('id')
              .eq(
                'student_id',
                identity.studentId
              )
              .limit(1)
              .maybeSingle()

          if (error) {
            console.error(
              'Gagal mencari student:',
              error
            )

            return null
          }

          if (data?.id) {
            return data.id
          }
        }

        // ------------------------------------------------------
        // BUAT STUDENT BARU
        // ------------------------------------------------------

        const {
          data,
          error,
        } =
          await supabase
            .from('students')
            .insert({
              name:
                identity.name,

              student_id:
                identity.studentId ||
                null,

              school:
                identity.school,

              class_name:
                identity.className,
            })
            .select('id')
            .single()

        if (error) {
          console.error(
            'Gagal membuat student:',
            error
          )

          return null
        }

        return data?.id ?? null
      },
      [identity]
    )

  // ==========================================================
  // CARI EXAM
  // ==========================================================

  const getExam =
    useCallback(
      async (): Promise<string | null> => {
        const {
          data,
          error,
        } =
          await supabase
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

        if (error) {
          console.error(
            'Gagal mencari exam:',
            error
          )

          return null
        }

        if (!data?.id) {
          console.error(
            'UJIAN TIDAK DITEMUKAN:',
            examConfig.title
          )

          return null
        }

        return data.id
      },
      []
    )

  // ==========================================================
  // BUAT ATTEMPT SUPABASE
  // ==========================================================

  const createSupabaseAttempt =
    useCallback(
      async (): Promise<string | null> => {
        if (!identity) {
          console.error(
            'Identitas peserta belum tersedia.'
          )

          return null
        }

        if (
          creatingAttemptRef.current
        ) {
          console.warn(
            'Pembuatan attempt sedang berlangsung.'
          )

          return null
        }

        creatingAttemptRef.current =
          true

        try {
          console.log(
            '=========================================='
          )

          console.log(
            'MEMULAI PEMBUATAN ATTEMPT'
          )

          // ----------------------------------------------------
          // STUDENT
          // ----------------------------------------------------

          const studentId =
            await getOrCreateStudent()

          if (!studentId) {
            return null
          }

          // ----------------------------------------------------
          // EXAM
          // ----------------------------------------------------

          const examId =
            await getExam()

          if (!examId) {
            return null
          }

          // ----------------------------------------------------
          // ATTEMPT
          // ----------------------------------------------------

          const startedAt =
            new Date().toISOString()

          const {
            data,
            error,
          } =
            await supabase
              .from('attempts')
              .insert({
                student_id:
                  studentId,

                exam_id:
                  examId,

                started_at:
                  startedAt,

                submitted_at:
                  null,

                total_questions:
                  questions.length,

                answered_count:
                  0,

                correct_count:
                  0,

                wrong_count:
                  0,

                unanswered_count:
                  questions.length,

                score:
                  0,

                status:
                  'in_progress',
              })
              .select('id')
              .single()

          if (error) {
            console.error(
              'ATTEMPT GAGAL DIBUAT:',
              error
            )

            return null
          }

          if (!data?.id) {
            console.error(
              'Attempt ID tidak tersedia.'
            )

            return null
          }

          console.log(
            'ATTEMPT BERHASIL DIBUAT:',
            data.id
          )

          return data.id
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
        getExam,
      ]
    )

  // ==========================================================
  // START EXAM
  // ==========================================================

  const startExam = useCallback(
    () => {
      const now =
        Date.now()

      console.log(
        'Reset simulasi...'
      )

      setSubmitted(
        false
      )

      setSubmittedAt(
        null
      )

      setCurrentIndex(
        0
      )

      setAttemptId(
        null
      )

      setAnswers(
        initAnswersMap(
          questions
        )
      )

      setTiming({
        startTime:
          now,

        endTime:
          now +
          examConfig.durationSeconds *
            1000,
      })

      void (
        async () => {
          const id =
            await createSupabaseAttempt()

          if (!id) {
            console.error(
              'ATTEMPT GAGAL DIBUAT.'
            )

            return
          }

          setAttemptId(
            id
          )

          console.log(
            'Attempt ID:',
            id
          )
        }
      )()
    },
    [
      setSubmitted,
      setSubmittedAt,
      setCurrentIndex,
      setAttemptId,
      setAnswers,
      setTiming,
      createSupabaseAttempt,
    ]
  )

  // ==========================================================
  // SIMPAN SEMUA ANSWERS KE SUPABASE
  // ==========================================================

  const saveAnswersToSupabase =
    useCallback(
      async (
        currentAttemptId: string
      ): Promise<void> => {
        console.log(
          'Menyimpan jawaban ke Supabase...'
        )

        // ------------------------------------------------------
        // Ambil UUID question dari Supabase
        // Berdasarkan nomor soal.
        // ------------------------------------------------------

        const {
          data: dbQuestions,
          error: questionError,
        } =
          await supabase
            .from('questions')
            .select(
              'id, number'
            )
            .order(
              'number',
              {
                ascending: true,
              }
            )

        if (questionError) {
          console.error(
            'Gagal mengambil questions:',
            questionError
          )

          throw questionError
        }

        if (
          !dbQuestions ||
          dbQuestions.length === 0
        ) {
          throw new Error(
            'Tabel questions Supabase kosong.'
          )
        }

        // ------------------------------------------------------
        // Buat mapping:
        //
        // nomor soal lokal
        //      ↓
        // UUID Supabase
        // ------------------------------------------------------

        const questionUuidMap =
          new Map<
            number,
            string
          >()

        for (
          const dbQuestion
          of dbQuestions
        ) {
          if (
            typeof dbQuestion.number ===
              'number' &&
            dbQuestion.id
          ) {
            questionUuidMap.set(
              dbQuestion.number,
              dbQuestion.id
            )
          }
        }

        // ------------------------------------------------------
        // SIMPAN SATU PER SATU
        // ------------------------------------------------------

        for (
          const question
          of questions
        ) {
          const record =
            answers[
              question.id
            ]

          const questionUuid =
            questionUuidMap.get(
              question.number
            )

          if (!questionUuid) {
            console.warn(
              `UUID question tidak ditemukan untuk soal ${question.number}`
            )

            continue
          }

          const answered =
            Boolean(
              record?.answered
            )

          const answer =
            record?.answer ?? null

          const isCorrect =
            answered
              ? checkAnswer(
                  answer,
                  question.answerKey
                )
              : null

          const serializedAnswer =
            serializeAnswer(
              answer
            )

          const answeredAt =
            answered
              ? new Date().toISOString()
              : null

          // ----------------------------------------------------
          // UPDATE RECORD YANG SUDAH ADA
          // ----------------------------------------------------

          const {
            data: existingAnswer,
            error: findAnswerError,
          } =
            await supabase
              .from('answers')
              .select('id')
              .eq(
                'attempt_id',
                currentAttemptId
              )
              .eq(
                'question_id',
                questionUuid
              )
              .limit(1)
              .maybeSingle()

          if (findAnswerError) {
            console.error(
              'Gagal mencari answer:',
              findAnswerError
            )

            throw findAnswerError
          }

          if (
            existingAnswer?.id
          ) {
            const {
              error: updateError,
            } =
              await supabase
                .from('answers')
                .update({
                  answer:
                    serializedAnswer,

                  is_correct:
                    isCorrect,

                  answered_at:
                    answeredAt,
                })
                .eq(
                  'id',
                  existingAnswer.id
                )

            if (updateError) {
              console.error(
                `Gagal update jawaban soal ${question.number}:`,
                updateError
              )

              throw updateError
            }
          }

          // ----------------------------------------------------
          // INSERT JIKA BELUM ADA
          // ----------------------------------------------------

          else {
            const {
              error: insertError,
            } =
              await supabase
                .from('answers')
                .insert({
                  attempt_id:
                    currentAttemptId,

                  question_id:
                    questionUuid,

                  answer:
                    serializedAnswer,

                  is_correct:
                    isCorrect,

                  answered_at:
                    answeredAt,
                })

            if (insertError) {
              console.error(
                `Gagal insert jawaban soal ${question.number}:`,
                insertError
              )

              throw insertError
            }
          }
        }

        console.log(
          'Semua jawaban berhasil disimpan.'
        )
      },
      [
        answers,
        checkAnswer,
        serializeAnswer,
      ]
    )

  // ==========================================================
  // SUBMIT EXAM
  // ==========================================================

  const submitExam =
    useCallback(
      () => {
        if (
          submitted
        ) {
          console.warn(
            'Ujian sudah disubmit.'
          )

          return
        }

        if (
          submittingRef.current
        ) {
          console.warn(
            'Proses submit sedang berlangsung.'
          )

          return
        }

        submittingRef.current =
          true

        const timestamp =
          Date.now()

        // ------------------------------------------------------
        // HITUNG HASIL
        // ------------------------------------------------------

        let answeredCount =
          0

        let correctCount =
          0

        for (
          const question
          of questions
        ) {
          const record =
            answers[
              question.id
            ]

          if (
            !record ||
            !record.answered
          ) {
            continue
          }

          answeredCount++

          const correct =
            checkAnswer(
              record.answer,
              question.answerKey
            )

          if (correct) {
            correctCount++
          }
        }

        const totalQuestions =
          questions.length

        const unansweredCount =
          Math.max(
            totalQuestions -
              answeredCount,
            0
          )

        const wrongCount =
          Math.max(
            answeredCount -
              correctCount,
            0
          )

        const score =
          totalQuestions > 0
            ? Number(
                (
                  correctCount /
                  totalQuestions *
                  100
                ).toFixed(2)
              )
            : 0

        console.log(
          '=========================================='
        )

        console.log(
          'HASIL UJIAN'
        )

        console.log(
          'Total:',
          totalQuestions
        )

        console.log(
          'Dijawab:',
          answeredCount
        )

        console.log(
          'Benar:',
          correctCount
        )

        console.log(
          'Salah:',
          wrongCount
        )

        console.log(
          'Kosong:',
          unansweredCount
        )

        console.log(
          'Nilai:',
          score
        )

        console.log(
          '=========================================='
        )

        // ------------------------------------------------------
        // LOCAL STATE
        // ------------------------------------------------------

        setSubmitted(
          true
        )

        setSubmittedAt(
          timestamp
        )

        // ------------------------------------------------------
        // JIKA TIDAK ADA ATTEMPT
        // ------------------------------------------------------

        if (!attemptId) {
          console.error(
            'ATTEMPT ID TIDAK DITEMUKAN.'
          )

          console.error(
            'Hasil hanya tersimpan secara lokal.'
          )

          submittingRef.current =
            false

          return
        }

        // ------------------------------------------------------
        // SIMPAN KE SUPABASE
        // ------------------------------------------------------

        void (
          async () => {
            try {
              console.log(
                'Memulai penyimpanan hasil...'
              )

              // ================================================
              // 1. SIMPAN ANSWERS
              // ================================================

              await saveAnswersToSupabase(
                attemptId
              )

              // ================================================
              // 2. UPDATE ATTEMPT
              // ================================================

              const {
                error:
                  attemptUpdateError,
              } =
                await supabase
                  .from('attempts')
                  .update({
                    submitted_at:
                      new Date(
                        timestamp
                      ).toISOString(),

                    total_questions:
                      totalQuestions,

                    answered_count:
                      answeredCount,

                    correct_count:
                      correctCount,

                    wrong_count:
                      wrongCount,

                    unanswered_count:
                      unansweredCount,

                    score:
                      score,

                    status:
                      'completed',
                  })
                  .eq(
                    'id',
                    attemptId
                  )

              if (
                attemptUpdateError
              ) {
                console.error(
                  'Gagal update attempts:',
                  attemptUpdateError
                )

                throw attemptUpdateError
              }

              console.log(
                '=========================================='
              )

              console.log(
                'HASIL UJIAN BERHASIL DISIMPAN'
              )

              console.log(
                'Attempt ID:',
                attemptId
              )

              console.log(
                'Status: completed'
              )

              console.log(
                'Total:',
                totalQuestions
              )

              console.log(
                'Dijawab:',
                answeredCount
              )

              console.log(
                'Benar:',
                correctCount
              )

              console.log(
                'Salah:',
                wrongCount
              )

              console.log(
                'Kosong:',
                unansweredCount
              )

              console.log(
                'Nilai:',
                score
              )

              console.log(
                '=========================================='
              )
            } catch (
              error
            ) {
              console.error(
                'SUBMIT SUPABASE ERROR:',
                error
              )
            } finally {
              submittingRef.current =
                false
            }
          }
        )()
      },
      [
        submitted,
        answers,
        attemptId,
        checkAnswer,
        setSubmitted,
        setSubmittedAt,
        saveAnswersToSupabase,
      ]
    )

  // ==========================================================
  // RESET SIMULATION
  // ==========================================================

  const resetSimulation =
    useCallback(
      () => {
        console.log(
          'Reset simulasi...'
        )

        setIdentityState(
          null
        )

        setAnswers(
          initAnswersMap(
            questions
          )
        )

        setTiming(
          null
        )

        setCurrentIndex(
          0
        )

        setSubmitted(
          false
        )

        setSubmittedAt(
          null
        )

        setAttemptId(
          null
        )

        creatingAttemptRef.current =
          false

        submittingRef.current =
          false
      },
      [
        setIdentityState,
        setAnswers,
        setTiming,
        setCurrentIndex,
        setSubmitted,
        setSubmittedAt,
        setAttemptId,
      ]
    )

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

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <ExamContext.Provider
      value={value}
    >
      {children}
    </ExamContext.Provider>
  )
}

// ============================================================
// USE EXAM
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
