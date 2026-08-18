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
  // Mencegah pembuatan attempt ganda
  // ==========================================================

  const creatingAttemptRef =
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
    [
      setIdentityState,
    ]
  )


  // ==========================================================
  // CEK JAWABAN KOSONG
  // ==========================================================

  const isEmptyAnswer = useCallback(
    (
      answer: AnswerRecord['answer']
    ) => {

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
    [
      setAnswers,
    ]
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
    [
      setCurrentIndex,
    ]
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
  // CREATE SUPABASE ATTEMPT
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
            'MEMULAI PEMBUATAN ATTEMPT SUPABASE'
          )

          console.log(
            'Identitas:',
            identity
          )


          // ====================================================
          // 1. CARI STUDENT
          // ====================================================

          let studentUuid:
            string | null = null


          if (
            identity.studentId
          ) {

            const {
              data: existingStudent,
              error: studentFindError,
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


            if (
              studentFindError
            ) {

              console.error(
                'Gagal mencari siswa:',
                studentFindError
              )

              return null
            }


            if (
              existingStudent
            ) {

              studentUuid =
                existingStudent.id

              console.log(
                'Siswa ditemukan:',
                studentUuid
              )
            }
          }


          // ====================================================
          // 2. BUAT STUDENT JIKA BELUM ADA
          // ====================================================

          if (
            !studentUuid
          ) {

            console.log(
              'Siswa belum ada. Membuat siswa baru...'
            )


            const {
              data: newStudent,
              error: studentInsertError,
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


            if (
              studentInsertError
            ) {

              console.error(
                'Gagal membuat siswa:',
                studentInsertError
              )

              return null
            }


            if (
              !newStudent?.id
            ) {

              console.error(
                'UUID siswa tidak dikembalikan.'
              )

              return null
            }


            studentUuid =
              newStudent.id


            console.log(
              'Siswa baru berhasil dibuat:',
              studentUuid
            )
          }


          // ====================================================
          // 3. CARI EXAM
          // ====================================================

          console.log(
            'Mencari exam:',
            examConfig.title
          )


          const {
            data: exam,
            error: examError,
          } =
            await supabase
              .from('exams')
              .select(
                `
                  id,
                  title,
                  year,
                  duration_minutes,
                  is_active
                `
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
            examError
          ) {

            console.error(
              'Gagal mencari ujian:',
              examError
            )

            return null
          }


          // ====================================================
          // EXAM TIDAK DITEMUKAN
          // ====================================================

          if (
            !exam
          ) {

            console.error(
              'UJIAN TIDAK DITEMUKAN'
            )

            console.error({
              title:
                examConfig.title,

              year:
                examConfig.year,
            })

            return null
          }


          console.log(
            'Exam ditemukan:',
            exam
          )


          // ====================================================
          // 4. BUAT ATTEMPT
          // ====================================================

          const startedAt =
            new Date().toISOString()


          console.log(
            'Mulai membuat attempt...'
          )


          const {
            data: newAttempt,
            error: attemptError,
          } =
            await supabase
              .from('attempts')
              .insert({

                student_id:
                  studentUuid,

                exam_id:
                  exam.id,

                started_at:
                  startedAt,

                total_questions:
                  questions.length,

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
              '=========================================='
            )

            console.error(
              'ATTEMPT SUPABASE GAGAL DIBUAT'
            )

            console.error(
              'Code:',
              attemptError.code
            )

            console.error(
              'Message:',
              attemptError.message
            )

            console.error(
              'Details:',
              attemptError.details
            )

            console.error(
              'Hint:',
              attemptError.hint
            )

            console.error(
              '=========================================='
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
            '=========================================='
          )

          console.log(
            'ATTEMPT BERHASIL DIBUAT'
          )

          console.log(
            'Attempt ID:',
            newAttempt.id
          )

          console.log(
            '=========================================='
          )


          return newAttempt.id as string


        } catch (
          error
        ) {

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


      // --------------------------------------------------------
      // RESET STATE UJIAN
      // --------------------------------------------------------

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


      // --------------------------------------------------------
      // RESET JAWABAN
      // --------------------------------------------------------

      setAnswers(
        initAnswersMap(
          questions
        )
      )


      // --------------------------------------------------------
      // START TIMER
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
      // BUAT ATTEMPT
      // --------------------------------------------------------

      void (
        async () => {

          console.log(
            'Mulai membuat attempt...'
          )


          const id =
            await createSupabaseAttempt()


          if (
            !id
          ) {

            console.error(
              'ATTEMPT GAGAL DIBUAT.'
            )

            return
          }


          setAttemptId(
            id
          )


          console.log(
            'Attempt ID tersimpan:',
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
  // CEK JAWABAN BENAR
  // ==========================================================

  const checkAnswer =
    useCallback(
      (
        userAnswer: AnswerRecord['answer'],
        answerKey: unknown
      ): boolean => {

        if (
          userAnswer === null ||
          answerKey === null ||
          userAnswer === undefined ||
          answerKey === undefined
        ) {
          return false
        }


        // ------------------------------------------------------
        // STRING
        // ------------------------------------------------------

        if (
          typeof userAnswer === 'string' &&
          typeof answerKey === 'string'
        ) {

          return (
            userAnswer ===
            answerKey
          )
        }


        // ------------------------------------------------------
        // ARRAY
        // ------------------------------------------------------

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


        // ------------------------------------------------------
        // OBJECT
        // ------------------------------------------------------

        if (
          typeof userAnswer === 'object' &&
          userAnswer !== null &&
          typeof answerKey === 'object' &&
          answerKey !== null &&
          !Array.isArray(userAnswer) &&
          !Array.isArray(answerKey)
        ) {

          return (
            JSON.stringify(userAnswer) ===
            JSON.stringify(answerKey)
          )
        }


        return false
      },
      []
    )


  // ==========================================================
  // SUBMIT EXAM
  // ==========================================================

  const submitExam =
    useCallback(
      () => {

        // ------------------------------------------------------
        // JANGAN SUBMIT DUA KALI
        // ------------------------------------------------------

        if (
          submitted
        ) {

          console.warn(
            'Ujian sudah disubmit.'
          )

          return
        }


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


          const answerKey =
            question.answerKey


          if (
            checkAnswer(
              record.answer,
              answerKey
            )
          ) {

            correctCount++
          }
        }


        const totalQuestions =
          questions.length


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


        // ------------------------------------------------------
        // UPDATE LOCAL STATE
        // ------------------------------------------------------

        setSubmitted(
          true
        )

        setSubmittedAt(
          timestamp
        )


        // ------------------------------------------------------
        // UPDATE SUPABASE
        // ------------------------------------------------------

        if (
          !attemptId
        ) {

          console.warn(
            'Tidak ada attempt_id.'
          )

          console.warn(
            'Hasil hanya tersimpan secara lokal.'
          )

          return
        }


        void (
          async () => {

            try {

              console.log(
                'Menyimpan hasil ujian...'
              )


              const {
                error,
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

                    score:
                      score,
                  })
                  .eq(
                    'id',
                    attemptId
                  )


              if (
                error
              ) {

                console.error(
                  'Gagal menyimpan hasil ujian:',
                  error
                )

                return
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
                'Total soal:',
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
                'Submit Supabase error:',
                error
              )
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
// useExam HOOK
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
