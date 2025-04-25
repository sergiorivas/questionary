import { App as KonstaApp } from 'konsta/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Question from './Question'

export default function App() {
  return (
    <KonstaApp safeAreas touchRipple theme="ios">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question" element={<Question />} />
        </Routes>
      </Router>
    </KonstaApp>
  )
}
