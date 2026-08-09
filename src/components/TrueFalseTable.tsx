import type { TrueFalseStatement } from '../types'
import MathText from './MathText'
import { ZoomableImage } from './ImageViewer'

export default function TrueFalseTable({
  statements,
  labels,
  value,
  onChange,
  onZoomImage,
}: {
  statements: TrueFalseStatement[]
  labels: [string, string]
  value: Record<string, string>
  onChange: (statementId: string, label: string) => void
  onZoomImage: (src: string, alt: string) => void
}) {
  return (
    <div className="overflow-x-auto -mx-1 sm:mx-0">
      <table className="w-full border-collapse text-sm mt-1">
        <thead>
          <tr className="bg-examblue-light text-examblue-dark">
            <th className="text-left font-semibold px-3 py-2 border border-examblue/20 rounded-tl-lg">
              Pernyataan
            </th>
            {labels.map((label) => (
              <th
                key={label}
                className="font-semibold px-3 py-2 border border-examblue/20 w-28 text-center last:rounded-tr-lg"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statements.map((st) => (
            <tr key={st.id} className="odd:bg-white even:bg-gray-50">
              <td className="px-3 py-3 border border-gray-200 align-top">
                <MathText text={st.text} className="text-gray-800" />
                {st.image && (
                  <div className="mt-2">
                    <ZoomableImage
                      src={st.image}
                      alt={st.text || 'Ilustrasi pernyataan'}
                      onOpen={onZoomImage}
                      className="max-w-[220px]"
                    />
                  </div>
                )}
              </td>
              {labels.map((label) => (
                <td key={label} className="border border-gray-200 text-center align-middle">
                  <input
                    type="radio"
                    name={`tf-${st.id}`}
                    className="w-4 h-4 accent-examblue"
                    checked={value[st.id] === label}
                    onChange={() => onChange(st.id, label)}
                    aria-label={`${st.text || 'Pernyataan'} - ${label}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
