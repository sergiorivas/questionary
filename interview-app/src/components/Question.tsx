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
  const [isPlaying, setIsPlaying] = useState(false)
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

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const playNext = () => {
    const voice = Math.floor(Math.random() * 11) + 1
    let index = 0
    if (currentIndex < questions.length - 1) {
      index = currentIndex + 1
    } else {
      index = 0
    }
    const current = questions[randomOrder[index]]
    const audio = new Audio(`/audios/${current.question_id}/${voice}.mp3`)

    nextQuestion()
    audio.addEventListener(
      'canplaythrough',
      () => {
        audio.play()
        setIsPlaying(true)
        audio.addEventListener(
          'ended',
          () => {
            setIsPlaying(false)
          },
          { once: true }
        )
      },
      { once: true }
    )
  }

  const play = () => {
    const voice = Math.floor(Math.random() * 11) + 1
    if (!currentQuestion) return
    const audio = new Audio(
      `/audios/${currentQuestion.question_id}/${voice}.mp3`
    )

    audio.addEventListener(
      'canplaythrough',
      () => {
        audio.play()
        setIsPlaying(true)
        audio.addEventListener(
          'ended',
          () => {
            setIsPlaying(false)
          },
          { once: true }
        )
      },
      { once: true }
    )
  }

  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="my-auto text-center text-4xl font-bold">
        {currentQuestion.question}
      </div>
      <div className="">
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            className="min-h-20 w-full rounded bg-green-600 px-4 py-2 text-2xl text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300 disabled:opacity-50"
            disabled={isPlaying}
            onClick={play}
          >
            Play
          </button>
          <button
            className="min-h-20 w-full rounded bg-blue-600 px-4 py-2 text-2xl text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:opacity-50"
            disabled={isPlaying}
            onClick={() => {
              playNext()
            }}
          >
            Next
          </button>
          <button
            className="min-h-20 w-full rounded bg-red-600 px-4 py-2 text-2xl text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 disabled:opacity-50"
            disabled={isPlaying}
            onClick={() => navigate('/')}
          >
            End
          </button>
        </div>
        <div className="mt-4 w-full text-center text-gray-500">
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
      </div>
    </div>
  )
}
