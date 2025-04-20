import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Question = {
  question_id: string
  question: string
  category: string
}

function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    fetch('/data/questions.csv')
      .then((response) => response.text())
      .then((csv) => {
        const lines = csv.split('\n').filter((line) => line.trim())
        const [, ...rows] = lines
        const parsedQuestions = rows.map((row) => {
          const [id, question, category] = row
            .split(',')
            .map((str) => str.replace(/^"|"$/g, ''))
          return { question_id: id, question, category }
        })
        setQuestions(parsedQuestions)
      })
  }, [])

  return questions
}

export default function Question() {
  const questions = useQuestions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [randomOrder, setRandomOrder] = useState<number[]>([])
  const navigate = useNavigate()

  // Inicializar orden aleatorio cuando se cargan las preguntas
  useEffect(() => {
    if (questions.length > 0) {
      const indices = Array.from({ length: questions.length }, (_, i) => i)
      const shuffled = indices.sort(() => Math.random() - 0.5)
      setRandomOrder(shuffled)
    }
  }, [questions.length])

  if (!questions.length || !randomOrder.length) {
    return <div>Cargando preguntas...</div>
  }

  const currentQuestion = questions[randomOrder[currentIndex]]

  const siguientePregunta = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const play = () => {
    const voice = Math.floor(Math.random() * 11) + 1
    if (!currentQuestion) return
    const audio = new Audio(
      `/audios/${currentQuestion.question_id}/${voice}.mp3`
    )
    audio.play()
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="mb-4 text-2xl font-bold">{currentQuestion.question}</div>
      <div className="flex gap-4">
        <button
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          onClick={() => {
            play()
          }}
        >
          Reproducir
        </button>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={siguientePregunta}
        >
          Siguiente pregunta
        </button>
        <button
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={() => navigate('/')}
        >
          Terminar
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Pregunta {currentIndex + 1} de {questions.length}
      </div>
    </div>
  )
}
