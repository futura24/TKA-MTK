export default function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="border-collapse text-sm w-full max-w-md">
        <thead>
          <tr className="bg-examblue-light text-examblue-dark">
            {headers.map((h) => (
              <th key={h} className="text-left font-semibold px-3 py-2 border border-examblue/20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 border border-gray-200 text-gray-800">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
