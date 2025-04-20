import { useState, useEffect } from 'react'

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
  const [voz, setVoz] = useState(0)

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
  const voces = window.speechSynthesis.getVoices()

  const reproducir = () => {
    const utter = new SpeechSynthesisUtterance(currentQuestion.question)
    if (voces[voz]) utter.voice = voces[voz]
    window.speechSynthesis.speak(utter)
  }

  const siguientePregunta = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="mb-4 text-2xl font-bold">{currentQuestion.question}</div>
      <div className="flex gap-4">
        <button
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          onClick={() => {
            setVoz((voz + 1) % voces.length)
            reproducir()
          }}
        >
          Repetir con otra voz
        </button>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={siguientePregunta}
        >
          Siguiente pregunta
        </button>
        <button
          className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          onClick={() => {
            /* lógica para guardar para repaso */
          }}
        >
          Guardar para repaso
        </button>
        <button
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={() => {
            /* lógica para terminar */
          }}
        >
          Terminar
        </button>
      </div>
      <button
        className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        onClick={reproducir}
      >
        Reproducir pregunta
      </button>
      <div className="mt-4 text-sm text-gray-500">
        Pregunta {currentIndex + 1} de {questions.length}
      </div>
    </div>
  )
}
