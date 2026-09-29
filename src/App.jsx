import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Simulator from './pages/Simulator'
import Compare from './pages/Compare'
import Ratio from './pages/Ratio'
import UniversityDetail from './pages/UniversityDetail'
import SubjectHelper from './pages/SubjectHelper'
import About from './pages/About'
import Documents from './pages/Documents'
import { DATA_AS_OF } from './data/universities'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/ratio" element={<Ratio />} />
          <Route path="/university/:slug" element={<UniversityDetail />} />
          <Route path="/subjects" element={<SubjectHelper />} />
          <Route path="/about" element={<About />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>{DATA_AS_OF} · <Link to="/documents">대학별 원문 보기</Link></p>
        <p>지원 전 반드시 각 대학 모집요강으로 최종 확인하세요.</p>
        <p>부산 교과전형 안내 · 동래고 김혜경</p>
      </footer>
    </>
  )
}
