import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import Papa from 'papaparse'

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
        const parsedData = Papa.parse<Question>(csv, {
          header: true,
          skipEmptyLines: true
        })
        const parsedQuestions = parsedData.data.map((row) => ({
          question_id: row.question_id,
          question: row.question,
          category: row.category
        }))
        setQuestions(parsedQuestions)
      })
      .catch((error) => {
        console.error('Error fetching questions:', error)
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
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener('ended', () => {})
      audioRef.current = null
    }
  }

  const playNext = () => {
    cleanupAudio()
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
            cleanupAudio()
          },
          { once: true }
        )
      },
      { once: true }
    )
  }

  const play = () => {
    cleanupAudio()
    if (!currentQuestion) return

    setIsPlaying(true)
    const voice = Math.floor(Math.random() * 11) + 1
    const audio = new Audio(
      `/audios/${currentQuestion.question_id}/${voice}.mp3`
    )

    audio.addEventListener(
      'canplaythrough',
      () => {
        audio.play()
        audio.addEventListener(
          'ended',
          () => {
            setTimeout(() => {
              setIsPlaying(false)
              cleanupAudio()
            }, 2000)
          },
          { once: true }
        )
      },
      { once: true }
    )
  }

  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="my-auto text-center text-2xl font-bold">
        <span className="text-red-600">({currentQuestion.question_id})</span>{' '}
        {currentQuestion.question}
        <div>
          <span className="text-sm text-gray-500">
            {currentQuestion.category}
          </span>
        </div>
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
