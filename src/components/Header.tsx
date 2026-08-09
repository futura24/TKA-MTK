import { GraduationCap } from 'lucide-react'
import { examConfig } from '../data/examConfig'

export default function Header() {
  return (
    <header className="bg-examblue text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="bg-white/15 rounded-full p-2">
          <GraduationCap className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold leading-tight text-sm sm:text-base">{examConfig.title}</p>
          <p className="text-xs text-white/80 leading-tight">{examConfig.subtitle}</p>
        </div>
      </div>
    </header>
  )
}
