import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

// ============================================================
// SUPABASE
// ============================================================
//
// SESUAIKAN PATH INI jika file supabase client Anda berbeda.
//
// Contoh:
// src/lib/supabase.ts
// src/hooks/useExam.ts
//
// maka:
// ../lib/supabase
//
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
const KEY_RESULT = 'tka_simulation_result'

// ============================================================
// DATABASE EXAM
// ============================================================
//
// Berdasarkan data Supabase Anda:
//
// "Simulasi TKA Matematika SMP"
// tahun 2026
// durasi 90 menit
//
const DEFAULT_EXAM_TITLE = 'Simulasi TKA Matematika SMP'

// ============================================================
// RESULT TYPE
// ============================================================

export interface ExamResult {
  totalQuestions: number
  answeredCount: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
  score: number
}

// ============================================================
// CONTEXT TYPE
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

  startExam: () => Promise<void>

  submitted: boolean
  submittedAt: number | null

  submitExam: () => Promise<void>

  attemptId: string | null

  result: ExamResult | null

  resetSimulation: () => void
}

// ============================================================
// CONTEXT
// ============================================================

const ExamContext = createContext<ExamContextValue | null>(null)

// ============================================================
// HELPER: EMPTY ANSWER
// ============================================================

function createEmptyAnswerRecord(
  questionId: number
): AnswerRecord {
  return {
    questionId,
    answer: null,
    answered: false,
    marked: false,
  }
}

// ============================================================
// HELPER: CEK JAWABAN KOSONG
// ============================================================

function isEmptyAnswer(
  answer: AnswerRecord['answer']
): boolean {
  if (answer === null || answer === undefined) {
    return true
  }

  if (answer === '') {
    return true
  }

  if (Array.isArray(answer)) {
    return answer.length === 0
  }

  if (
    typeof answer === 'object' &&
    answer !== null
  ) {
    return Object.keys(answer).length === 0
  }

  return false
}

// ============================================================
// HELPER: NORMALISASI NILAI
// ============================================================

function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value
      .map(normalizeValue)
      .sort((a, b) =>
        JSON.stringify(a).localeCompare(
          JSON.stringify(b)
        )
      )
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    return Object.keys(obj)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = normalizeValue(obj[key])
          return result
        },
        {} as Record<string, unknown>
      )
  }

  return value
}

// ============================================================
// HELPER: BANDINGKAN JAWABAN
// ============================================================

function answersAreEqual(
  userAnswer: unknown,
  correctAnswer: unknown
): boolean {
  return (
    JSON.stringify(normalizeValue(userAnswer)) ===
    JSON.stringify(normalizeValue(correctAnswer))
  )
}

// ============================================================
// HELPER: AMBIL KUNCI JAWABAN
// ============================================================
//
// Dibuat fleksibel agar tidak langsung error jika struktur
// questions.ts menggunakan nama:
//
// correctAnswer
// answer
// answerKey
// correct_answer
// key
//
// ============================================================

function getCorrectAnswer(
  question: unknown
): unknown {
  if (!question) {
    return null
  }

  const q = question as Record<string, unknown>

  const candidates = [
    q.correctAnswer,
    q.answer,
    q.answerKey,
    q.correct_answer,
    q.correct,
    q.key,
  ]

  for (const candidate of candidates) {
    if (
      candidate !== undefined &&
      candidate !== null
    ) {
      return candidate
    }
  }

  return null
}

// ============================================================
// HELPER: DAPATKAN SUPABASE QUESTION ID
// ============================================================
//
// Karena frontend Anda menggunakan questionId number,
// sedangkan Supabase answers.question_id menggunakan UUID,
// fungsi ini mencoba beberapa kemungkinan mapping.
//
// Prioritas:
//
// 1. ID UUID yang sudah ada di local question
// 2. question number
// 3. number
// 4. order
// 5. nomor
// 6. fallback berdasarkan index
//
// ============================================================

function resolveDatabaseQuestionId(
  localQuestion: unknown,
  databaseQuestions: Record<string, unknown>[],
  index: number
): string | null {
  const local = localQuestion as Record<
    string,
    unknown
  >

  const localCandidates = [
    local.supabaseId,
    local.databaseId,
    local.dbId,
    local.uuid,
    local.id,
  ]

  for (const localId of localCandidates) {
    if (
      localId === undefined ||
      localId === null
    ) {
      continue
    }

    const found = databaseQuestions.find(
      (dbQuestion) => {
        return String(dbQuestion.id) === String(localId)
      }
    )

    if (found?.id) {
      return String(found.id)
    }
  }

  const localNumberCandidates = [
    local.questionNumber,
    local.number,
    local.order,
    local.no,
    local.nomor,
  ]

  const dbNumberFields = [
    'question_number',
    'questionNumber',
    'number',
    'order',
    'no',
    'nomor',
  ]

  for (const localNumber of localNumberCandidates) {
    if (
      localNumber === undefined ||
      localNumber === null
    ) {
      continue
    }

    for (const dbField of dbNumberFields) {
      const found = databaseQuestions.find(
        (dbQuestion) =>
          String(dbQuestion[dbField]) ===
          String(localNumber)
      )

      if (found?.id) {
        return String(found.id)
      }
    }
  }

  // Fallback berdasarkan posisi.
  //
  // Ini hanya digunakan jika jumlah soal database
  // dan soal frontend sama.
  //
  if (
    databaseQuestions.length ===
    questions.length
  ) {
    const fallback = databaseQuestions[index]

    if (fallback?.id) {
      console.warn(
        `[TKA] Mapping question menggunakan index ${index + 1}.`
      )

      return String(fallback.id)
    }
  }

  return null
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
  // IDENTITY
  // ==========================================================

  const [
    identity,
    setIdentityState,
  ] =
    useLocalStorage<ParticipantIdentity | null>(
      KEY_IDENTITY,
      null
    )

  // ==========================================================
  // ANSWERS
  // ==========================================================

  const [
    answers,
    setAnswers,
  ] =
    useLocalStorage<AnswersMap>(
      KEY_ANSWERS,
      initAnswersMap(questions)
    )

  // ==========================================================
  // TIMING
  // ==========================================================

  const [
    timing,
    setTiming,
  ] =
    useLocalStorage<ExamTiming | null>(
      KEY_TIMING,
      null
    )

  // ==========================================================
  // CURRENT QUESTION
  // ==========================================================

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useLocalStorage<number>(
      KEY_CURRENT,
      0
    )

  // ==========================================================
  // SUBMITTED
  // ==========================================================

  const [
    submitted,
    setSubmitted,
  ] =
    useLocalStorage<boolean>(
      KEY_SUBMITTED,
      false
    )

  // ==========================================================
  // SUBMITTED AT
  // ==========================================================

  const [
    submittedAt,
    setSubmittedAt,
  ] =
    useLocalStorage<number | null>(
      KEY_SUBMITTED_AT,
      null
    )

  // ==========================================================
  // ATTEMPT ID
  // ==========================================================

  const [
    attemptId,
    setAttemptId,
  ] =
    useLocalStorage<string | null>(
      KEY_ATTEMPT_ID,
      null
    )

  // ==========================================================
  // RESULT
  // ==========================================================

  const [
    result,
    setResult,
  ] =
    useLocalStorage<ExamResult | null>(
      KEY_RESULT,
      null
    )

  // ==========================================================
  // SET IDENTITY
  // ==========================================================

  const setIdentity = useCallback(
    (id: ParticipantIdentity) => {
      setIdentityState(id)
    },
    [setIdentityState]
  )

  // ==========================================================
  // SET ANSWER
  // ==========================================================

  const setAnswer = useCallback(
    (
      questionId: number,
      answer: AnswerRecord['answer']
    ) => {
      setAnswers((prev) => {
        const prevRec =
          prev[questionId] ??
          createEmptyAnswerRecord(
            questionId
          )

        const empty = isEmptyAnswer(answer)

        return {
          ...prev,
          [questionId]: {
            ...prevRec,
            questionId,
            answer,
            answered: !empty,
          },
        }
      })
    },
    [setAnswers]
  )

  // ==========================================================
  // TOGGLE MARK
  // ==========================================================

  const toggleMark = useCallback(
    (questionId: number) => {
      setAnswers((prev) => {
        const prevRec =
          prev[questionId] ??
          createEmptyAnswerRecord(
            questionId
          )

        return {
          ...prev,
          [questionId]: {
            ...prevRec,
            marked: !prevRec.marked,
          },
        }
      })
    },
    [setAnswers]
  )

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(
        Math.max(index, 0),
        questions.length - 1
      )

      setCurrentIndex(clamped)
    },
    [setCurrentIndex]
  )

  const goNext = useCallback(() => {
    goToIndex(currentIndex + 1)
  }, [
    currentIndex,
    goToIndex,
  ])

  const goPrev = useCallback(() => {
    goToIndex(currentIndex - 1)
  }, [
    currentIndex,
    goToIndex,
  ])

  // ==========================================================
  // GET EXAM TITLE
  // ==========================================================

  const getExamTitle = useCallback(() => {
    const config =
      examConfig as unknown as Record<
        string,
        unknown
      >

    const configuredTitle =
      config.title

    if (
      typeof configuredTitle === 'string' &&
      configuredTitle.trim()
    ) {
      return configuredTitle.trim()
    }

    return DEFAULT_EXAM_TITLE
  }, [])

  // ==========================================================
  // CREATE / FIND STUDENT
  // ==========================================================

  const getOrCreateStudent = useCallback(
    async () => {
      if (!identity) {
        throw new Error(
          'Identitas peserta belum tersedia.'
        )
      }

      const participant =
        identity as unknown as Record<
          string,
          unknown
        >

      const studentId =
        participant.studentId ??
        participant.nis ??
        participant.nisn

      const name =
        participant.name ??
        participant.nama

      const school =
        participant.school ??
        participant.schoolName

      const className =
        participant.className ??
        participant.class

      if (
        typeof studentId !== 'string' ||
        !studentId.trim()
      ) {
        throw new Error(
          'NIS/NISN belum tersedia.'
        )
      }

      // --------------------------------------------------------
      // Cari siswa
      // --------------------------------------------------------

      const {
        data: existingStudent,
        error: findError,
      } = await supabase
        .from('students')
        .select('id, student_id, name, school, class_name')
        .eq(
          'student_id',
          studentId.trim()
        )
        .maybeSingle()

      if (findError) {
        throw findError
      }

      if (existingStudent?.id) {
        return existingStudent
      }

      // --------------------------------------------------------
      // Buat siswa baru
      // --------------------------------------------------------

      const {
        data: createdStudent,
        error: createError,
      } = await supabase
        .from('students')
        .insert({
          name:
            typeof name === 'string'
              ? name.trim()
              : 'Peserta TKA',

          student_id:
            studentId.trim(),

          school:
            typeof school === 'string'
              ? school.trim()
              : '',

          class_name:
            typeof className === 'string'
              ? className.trim()
              : '',
        })
        .select(
          'id, student_id, name, school, class_name'
        )
        .single()

      if (createError) {
        throw createError
      }

      if (!createdStudent?.id) {
        throw new Error(
          'Siswa berhasil dibuat tetapi ID siswa tidak ditemukan.'
        )
      }

      return createdStudent
    },
    [identity]
  )

  // ==========================================================
  // FIND EXAM
  // ==========================================================

  const getExam = useCallback(
    async () => {
      const configuredTitle =
        getExamTitle()

      // --------------------------------------------------------
      // Pertama cari berdasarkan judul persis
      // --------------------------------------------------------

      let {
        data: exam,
        error,
      } = await supabase
        .from('exams')
        .select(
          'id, title, year, duration_minutes, is_active'
        )
        .eq(
          'title',
          configuredTitle
        )
        .eq(
          'is_active',
          true
        )
        .maybeSingle()

      if (error) {
        throw error
      }

      // --------------------------------------------------------
      // Jika tidak ditemukan, coba judul default
      // --------------------------------------------------------

      if (
        !exam &&
        configuredTitle !==
          DEFAULT_EXAM_TITLE
      ) {
        const fallback =
          await supabase
            .from('exams')
            .select(
              'id, title, year, duration_minutes, is_active'
            )
            .eq(
              'title',
              DEFAULT_EXAM_TITLE
            )
            .eq(
              'is_active',
              true
            )
            .maybeSingle()

        if (fallback.error) {
          throw fallback.error
        }

        exam = fallback.data
      }

      // --------------------------------------------------------
      // Coba ilike
      // --------------------------------------------------------

      if (!exam) {
        const fallback =
          await supabase
            .from('exams')
            .select(
              'id, title, year, duration_minutes, is_active'
            )
            .ilike(
              'title',
              configuredTitle
            )
            .eq(
              'is_active',
              true
            )
            .limit(1)
            .maybeSingle()

        if (fallback.error) {
          throw fallback.error
        }

        exam = fallback.data
      }

      if (!exam?.id) {
        throw new Error(
          `UJIAN TIDAK DITEMUKAN: "${configuredTitle}"`
        )
      }

      return exam
    },
    [getExamTitle]
  )

  // ==========================================================
  // START EXAM
  // ==========================================================

  const startExam = useCallback(
    async () => {
      try {
        console.log(
          '========================================'
        )
        console.log(
          'MEMULAI UJIAN TKA'
        )
        console.log(
          '========================================'
        )

        // ------------------------------------------------------
        // Jangan membuat attempt baru jika attempt lama
        // masih aktif.
        // ------------------------------------------------------

        if (
          attemptId &&
          !submitted
        ) {
          console.log(
            'Attempt masih aktif:',
            attemptId
          )

          if (!timing) {
            const now = Date.now()

            setTiming({
              startTime: now,
              endTime:
                now +
                examConfig.durationSeconds *
                  1000,
            })
          }

          return
        }

        // ------------------------------------------------------
        // Reset jawaban untuk ujian baru
        // ------------------------------------------------------

        setAnswers(
          initAnswersMap(questions)
        )

        setResult(null)
        setSubmitted(false)
        setSubmittedAt(null)
        setCurrentIndex(0)

        // ------------------------------------------------------
        // Waktu ujian
        // ------------------------------------------------------

        const now = Date.now()

        const newTiming: ExamTiming = {
          startTime: now,
          endTime:
            now +
            examConfig.durationSeconds *
              1000,
        }

        setTiming(newTiming)

        // ------------------------------------------------------
        // Jika identity belum ada, tetap jalankan lokal.
        // ------------------------------------------------------

        if (!identity) {
          console.warn(
            '[TKA] Identity belum tersedia. Attempt Supabase tidak dibuat.'
          )

          setAttemptId(null)

          return
        }

        // ------------------------------------------------------
        // Cari / buat student
        // ------------------------------------------------------

        console.log(
          'Mencari / membuat siswa...'
        )

        const student =
          await getOrCreateStudent()

        console.log(
          'Student ID:',
          student.id
        )

        // ------------------------------------------------------
        // Cari exam
        // ------------------------------------------------------

        console.log(
          'Mencari exam:',
          getExamTitle()
        )

        const exam =
          await getExam()

        console.log(
          'Exam ID:',
          exam.id
        )

        // ------------------------------------------------------
        // Buat attempt
        // ------------------------------------------------------

        console.log(
          'Membuat attempt Supabase...'
        )

        const {
          data: newAttempt,
          error: attemptError,
        } = await supabase
          .from('attempts')
          .insert({
            student_id: student.id,
            exam_id: exam.id,
            started_at:
              new Date().toISOString(),
          })
          .select('id')
          .single()

        if (attemptError) {
          throw attemptError
        }

        if (!newAttempt?.id) {
          throw new Error(
            'Attempt berhasil dibuat tetapi ID tidak ditemukan.'
          )
        }

        setAttemptId(
          String(newAttempt.id)
        )

        console.log(
          'ATTEMPT BERHASIL DIBUAT:',
          newAttempt.id
        )
      } catch (error) {
        console.error(
          '========================================'
        )

        console.error(
          'GAGAL MEMBUAT ATTEMPT SUPABASE'
        )

        console.error(error)

        console.error(
          'Ujian tetap dilanjutkan secara lokal.'
        )

        console.error(
          '========================================'
        )

        // ------------------------------------------------------
        // Jangan membuat peserta tidak bisa ujian hanya karena
        // backend gagal.
        // ------------------------------------------------------

        setAttemptId(null)
      }
    },
    [
      attemptId,
      submitted,
      timing,
      identity,
      getOrCreateStudent,
      getExam,
      getExamTitle,
      setAnswers,
      setResult,
      setSubmitted,
      setSubmittedAt,
      setCurrentIndex,
      setTiming,
      setAttemptId,
    ]
  )

  // ==========================================================
  // CALCULATE LOCAL RESULT
  // ==========================================================

  const calculateLocalResult =
    useCallback((): ExamResult => {
      const totalQuestions =
        questions.length

      let answeredCount = 0
      let correctCount = 0
      let wrongCount = 0

      questions.forEach(
        (question, index) => {
          const localQuestion =
            question as unknown as Record<
              string,
              unknown
            >

          const questionId =
            Number(localQuestion.id)

          const answerRecord =
            answers[questionId]

          if (
            !answerRecord ||
            !answerRecord.answered
          ) {
            return
          }

          answeredCount++

          const correctAnswer =
            getCorrectAnswer(
              question
            )

          const isCorrect =
            answersAreEqual(
              answerRecord.answer,
              correctAnswer
            )

          if (isCorrect) {
            correctCount++
          } else {
            wrongCount++
          }

          // Hindari warning unused index pada beberapa
          // konfigurasi TypeScript.
          void index
        }
      )

      const unansweredCount =
        Math.max(
          0,
          totalQuestions -
            answeredCount
        )

      const score =
        totalQuestions > 0
          ? Number(
              (
                (correctCount /
                  totalQuestions) *
                100
              ).toFixed(2)
            )
          : 0

      return {
        totalQuestions,
        answeredCount,
        correctCount,
        wrongCount,
        unansweredCount,
        score,
      }
    }, [answers])

  // ==========================================================
  // LOAD DATABASE QUESTIONS
  // ==========================================================

  const loadDatabaseQuestions =
    useCallback(async () => {
      const {
        data,
        error,
      } = await supabase
        .from('questions_public')
        .select('*')

      if (error) {
        throw error
      }

      return (
        (data ?? []) as Record<
          string,
          unknown
        >[]
      )
    }, [])

  // ==========================================================
  // SAVE ANSWERS TO SUPABASE
  // ==========================================================

  const saveAnswersToSupabase =
    useCallback(
      async (
        currentAttemptId: string
      ) => {
        console.log(
          'Menyimpan jawaban ke Supabase...'
        )

        // ------------------------------------------------------
        // Ambil questions dari database
        // ------------------------------------------------------

        let databaseQuestions:
          Record<
            string,
            unknown
          >[] = []

        try {
          databaseQuestions =
            await loadDatabaseQuestions()
        } catch (error) {
          console.warn(
            '[TKA] Tidak dapat mengambil questions_public:',
            error
          )
        }

        // ------------------------------------------------------
        // Ambil answer yang sudah ada
        // ------------------------------------------------------

        const {
          data: existingAnswers,
          error: existingError,
        } = await supabase
          .from('answers')
          .select(
            'id, attempt_id, question_id, answer, is_correct'
          )
          .eq(
            'attempt_id',
            currentAttemptId
          )

        if (existingError) {
          throw existingError
        }

        // ------------------------------------------------------
        // Proses setiap soal
        // ------------------------------------------------------

        for (
          let index = 0;
          index < questions.length;
          index++
        ) {
          const question =
            questions[index]

          const local =
            question as unknown as Record<
              string,
              unknown
            >

          const localQuestionId =
            Number(local.id)

          const answerRecord =
            answers[localQuestionId]

          const correctAnswer =
            getCorrectAnswer(
              question
            )

          const hasAnswer =
            Boolean(
              answerRecord?.answered
            )

          const userAnswer =
            hasAnswer
              ? answerRecord.answer
              : null

          const isCorrect =
            hasAnswer &&
            answersAreEqual(
              userAnswer,
              correctAnswer
            )

          // ----------------------------------------------------
          // Cari question UUID database
          // ----------------------------------------------------

          let databaseQuestionId =
            resolveDatabaseQuestionId(
              question,
              databaseQuestions,
              index
            )

          // ----------------------------------------------------
          // Jika belum ditemukan, coba dari answer existing
          // berdasarkan urutan
          // ----------------------------------------------------

          if (
            !databaseQuestionId &&
            existingAnswers &&
            existingAnswers[index]
          ) {
            databaseQuestionId =
              String(
                existingAnswers[index]
                  .question_id
              )
          }

          if (
            !databaseQuestionId
          ) {
            console.warn(
              `[TKA] Question ${index + 1} tidak memiliki mapping UUID Supabase.`
            )

            continue
          }

          // ----------------------------------------------------
          // Cari existing answer
          // ----------------------------------------------------

          const existing =
            existingAnswers?.find(
              (item) =>
                String(
                  item.question_id
                ) ===
                String(
                  databaseQuestionId
                )
            )

          // ----------------------------------------------------
          // UPDATE jika sudah ada
          // ----------------------------------------------------

          if (existing?.id) {
            const {
              error: updateError,
            } = await supabase
              .from('answers')
              .update({
                answer: hasAnswer
                  ? userAnswer
                  : null,
                is_correct:
                  hasAnswer
                    ? isCorrect
                    : false,
              })
              .eq(
                'id',
                existing.id
              )

            if (updateError) {
              console.error(
                `[TKA] Gagal update answer soal ${index + 1}:`,
                updateError
              )
            }

            continue
          }

          // ----------------------------------------------------
          // INSERT jika belum ada
          // ----------------------------------------------------

          const {
            error: insertError,
          } = await supabase
            .from('answers')
            .insert({
              attempt_id:
                currentAttemptId,

              question_id:
                databaseQuestionId,

              answer:
                hasAnswer
                  ? userAnswer
                  : null,

              is_correct:
                hasAnswer
                  ? isCorrect
                  : false,
            })

          if (insertError) {
            console.error(
              `[TKA] Gagal insert answer soal ${index + 1}:`,
              insertError
            )
          }
        }

        console.log(
          'Semua jawaban selesai disinkronkan.'
        )
      },
      [
        answers,
        loadDatabaseQuestions,
      ]
    )

  // ==========================================================
  // UPDATE ATTEMPT RESULT
  // ==========================================================

  const updateAttemptResult =
    useCallback(
      async (
        currentAttemptId: string,
        finalResult: ExamResult
      ) => {
        const {
          error,
        } = await supabase
          .from('attempts')
          .update({
            submitted_at:
              new Date().toISOString(),

            total_questions:
              finalResult.totalQuestions,

            answered_count:
              finalResult.answeredCount,

            correct_count:
              finalResult.correctCount,

            wrong_count:
              finalResult.wrongCount,

            score:
              finalResult.score,
          })
          .eq(
            'id',
            currentAttemptId
          )

        if (error) {
          throw error
        }

        console.log(
          'Attempt berhasil diperbarui:',
          {
            attemptId:
              currentAttemptId,

            ...finalResult,
          }
        )
      },
      []
    )

  // ==========================================================
  // SUBMIT EXAM
  // ==========================================================

  const submitExam = useCallback(
    async () => {
      if (submitted) {
        console.log(
          '[TKA] Submit diabaikan karena ujian sudah submit.'
        )

        return
      }

      console.log(
        '========================================'
      )

      console.log(
        'SUBMIT UJIAN TKA'
      )

      console.log(
        '========================================'
      )

      // ------------------------------------------------------
      // Hitung hasil lokal terlebih dahulu
      // ------------------------------------------------------

      const finalResult =
        calculateLocalResult()

      console.log(
        'HASIL LOKAL:',
        finalResult
      )

      // ------------------------------------------------------
      // Simpan lokal
      // ------------------------------------------------------

      setResult(
        finalResult
      )

      setSubmitted(
        true
      )

      const finalSubmittedAt =
        Date.now()

      setSubmittedAt(
        finalSubmittedAt
      )

      // ------------------------------------------------------
      // Jika tidak ada attempt Supabase
      // ------------------------------------------------------

      if (!attemptId) {
        console.warn(
          '[TKA] Tidak ada attempt_id Supabase.'
        )

        console.log(
          '[TKA] Hasil tetap tersedia secara lokal.'
        )

        return
      }

      // ------------------------------------------------------
      // Simpan ke Supabase
      // ------------------------------------------------------

      try {
        // 1. Simpan semua answers
        await saveAnswersToSupabase(
          attemptId
        )

        // 2. Update attempt
        await updateAttemptResult(
          attemptId,
          finalResult
        )

        console.log(
          '========================================'
        )

        console.log(
          'SUBMIT SUPABASE BERHASIL'
        )

        console.log(
          '========================================'
        )
      } catch (error) {
        console.error(
          '========================================'
        )

        console.error(
          'GAGAL SUBMIT KE SUPABASE'
        )

        console.error(error)

        console.error(
          'Hasil lokal tetap tersimpan.'
        )

        console.error(
          '========================================'
        )
      }
    },
    [
      submitted,
      attemptId,
      calculateLocalResult,
      saveAnswersToSupabase,
      updateAttemptResult,
      setResult,
      setSubmitted,
      setSubmittedAt,
    ]
  )

  // ==========================================================
  // RESET SIMULATION
  // ==========================================================

  const resetSimulation =
    useCallback(() => {
      console.log(
        'Reset simulasi...'
      )

      setIdentityState(
        null
      )

      setAnswers(
        initAnswersMap(questions)
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

      setResult(
        null
      )

      console.log(
        'Reset simulasi selesai.'
      )
    }, [
      setIdentityState,
      setAnswers,
      setTiming,
      setCurrentIndex,
      setSubmitted,
      setSubmittedAt,
      setAttemptId,
      setResult,
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

        result,

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
        result,
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
  const ctx =
    useContext(
      ExamContext
    )

  if (!ctx) {
    throw new Error(
      'useExam harus dipakai di dalam <ExamProvider>'
    )
  }

  return ctx
}
