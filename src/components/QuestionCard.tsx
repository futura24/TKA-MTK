import type { AnswerRecord, Question } from '../types'
import MathText from './MathText'
import { ZoomableImage } from './ImageViewer'
import QuestionOptionItem from './QuestionOption'
import TrueFalseTable from './TrueFalseTable'
import DataTable from './DataTable'
import { getStimulus } from '../data/stimuli'
import StimulusCard from './Stimulus'

export default function QuestionCard({
  question,
  record,
  onAnswerChange,
  onZoomImage,
  fontSize,
}: {
  question: Question
  record: AnswerRecord | undefined
  onAnswerChange: (answer: AnswerRecord['answer']) => void
  onZoomImage: (src: string, alt: string) => void
  fontSize: 'sm' | 'md' | 'lg'
}) {
  const stimulus = getStimulus(question.stimulusId)
  const fontClass =
    fontSize === 'sm' ? 'font-size-sm' : fontSize === 'lg' ? 'font-size-lg' : 'font-size-md'

  const answer = record?.answer ?? null

  function isSingleSelected(optId: string) {
    return answer === optId
  }
  function isMultiSelected(optId: string) {
    return Array.isArray(answer) && answer.includes(optId)
  }
  function toggleSingle(optId: string) {
    onAnswerChange(optId)
  }
  function toggleMulti(optId: string) {
    const current = Array.isArray(answer) ? answer : []
    if (current.includes(optId)) {
      onAnswerChange(current.filter((v) => v !== optId))
    } else {
      onAnswerChange([...current, optId])
    }
  }
  function setTrueFalse(statementId: string, label: string) {
    const current = answer && typeof answer === 'object' && !Array.isArray(answer) ? { ...(answer as Record<string, string>) } : {}
    current[statementId] = label
    onAnswerChange(current)
  }

  return (
    <div className={`animate-fade-slide ${fontClass}`} key={question.id}>
      {stimulus && <StimulusCard stimulus={stimulus} onZoomImage={onZoomImage} />}

      <div className="mb-4">
        <MathText text={question.question} className="text-gray-900 leading-relaxed" />

        {question.table && (
          <DataTable headers={question.table.headers} rows={question.table.rows} />
        )}

        {question.image && (
          <div className="my-3">
            <ZoomableImage
              src={question.image}
              alt={`Ilustrasi soal nomor ${question.number}`}
              onOpen={onZoomImage}
            />
          </div>
        )}
        {question.images?.map((img, i) => (
          <div className="my-3" key={i}>
            <ZoomableImage
              src={img}
              alt={`Ilustrasi soal nomor ${question.number} - ${i + 1}`}
              onOpen={onZoomImage}
            />
          </div>
        ))}
      </div>

      {(question.type === 'single-choice' || question.type === 'multiple-choice') && question.options && (
        <div className="space-y-2.5">
          {question.type === 'multiple-choice' && (
            <p className="text-xs font-medium text-examblue-dark bg-examblue-light/70 inline-block px-2.5 py-1 rounded-full mb-1">
              Jawaban benar bisa lebih dari satu
            </p>
          )}
          {question.options.map((opt) => (
            <QuestionOptionItem
              key={opt.id}
              option={opt}
              type={question.type}
              selected={
                question.type === 'multiple-choice' ? isMultiSelected(opt.id) : isSingleSelected(opt.id)
              }
              onToggle={() =>
                question.type === 'multiple-choice' ? toggleMulti(opt.id) : toggleSingle(opt.id)
              }
              name={`q-${question.id}`}
              onZoomImage={onZoomImage}
            />
          ))}
        </div>
      )}

      {question.type === 'true-false' && question.statements && (
        <TrueFalseTable
          statements={question.statements}
          labels={question.trueFalseLabels ?? ['Benar', 'Salah']}
          value={(answer && typeof answer === 'object' && !Array.isArray(answer) ? (answer as Record<string, string>) : {})}
          onChange={setTrueFalse}
          onZoomImage={onZoomImage}
        />
      )}
    </div>
  )
}
