import { Routes, Route, Navigate } from 'react-router-dom'
import { ExamProvider } from './hooks/useExam'
import Home from './pages/Home'
import Identity from './pages/Identity'
import Instructions from './pages/Instructions'
import Exam from './pages/Exam'
import Result from './pages/Result'
import Review from './pages/Review'

export default function App() {
  return (
    <ExamProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/identitas" element={<Identity />} />
        <Route path="/petunjuk" element={<Instructions />} />
        <Route path="/ujian" element={<Exam />} />
        <Route path="/hasil" element={<Result />} />
        <Route path="/review" element={<Review />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ExamProvider>
  )
}
