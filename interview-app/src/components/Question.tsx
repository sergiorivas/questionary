import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Howl } from 'howler'
import { useQuestions } from 'hooks/useQuestions'

export type Question = {
  question_id: string
  question: string
  category: string
}

export default function Question() {
  const questions = useQuestions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [randomOrder, setRandomOrder] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const navigate = useNavigate()

  const playAudio = (questionId: string) => {
    const voice = Math.floor(Math.random() * 11) + 1
    const sound = new Howl({
      src: [`/audios/${questionId}/${voice}.mp3`],
      preload: true,
      onload: () => {
        setIsPlaying(true)
        sound.play()
      },
      onend: () => {
        setIsPlaying(false)
      }
    })
  }

  useEffect(() => {
    if (questions.length > 0) {
      const shuffled = Array.from(
        { length: questions.length },
        (_, i) => i
      ).sort(() => Math.random() - 0.5)
      setRandomOrder(shuffled)
      playAudio(questions[shuffled[0]].question_id)
    }
  }, [questions])

  if (!questions.length || !randomOrder.length) {
    return <div>Cargando preguntas...</div>
  }

  const currentQuestion = questions[randomOrder[currentIndex]]

  function goToNextQuestion(playAudioForNext = false) {
    const nextIndex = (currentIndex + 1) % questions.length
    setCurrentIndex(nextIndex)
    if (playAudioForNext) {
      playAudio(questions[randomOrder[nextIndex]].question_id)
    }
  }

  const playNext = () => {
    goToNextQuestion(true)
  }

  const play = () => {
    if (!currentQuestion) return
    playAudio(currentQuestion.question_id)
  }

  return (
    <div className="flex h-screen w-full flex-col p-4 pb-20">
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
            onClick={playNext}
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
