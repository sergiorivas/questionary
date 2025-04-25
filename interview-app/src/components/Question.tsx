import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestions } from 'hooks/useQuestions'
import useAudioPlayer from 'hooks/useAudioPlayer'
import {
  Page,
  Navbar,
  Card,
  Block,
  Tabbar,
  Link,
  Chip,
  TabbarLink
} from 'konsta/react'

export default function Question() {
  const questions = useQuestions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [randomOrder, setRandomOrder] = useState<number[]>([])
  const { isPlaying, playAudio } = useAudioPlayer()
  const navigate = useNavigate()

  useEffect(() => {
    if (questions.length > 0) {
      const shuffled = Array.from(
        { length: questions.length },
        (_, i) => i
      ).sort(() => Math.random() - 0.5)
      setRandomOrder(shuffled)
    }
  }, [questions])

  useEffect(() => {
    if (randomOrder.length > 0 && !isPlaying && !pressed) {
      setPressed(true)
      setTimeout(() => {
        play()
        setPressed(false)
      }, 0)
    }
  }, [randomOrder, currentIndex])

  if (!questions.length || !randomOrder.length) {
    return (
      <Page>
        <Block className="flex h-screen items-center justify-center">
          Loading...
        </Block>
      </Page>
    )
  }

  const currentQuestion = questions[randomOrder[currentIndex]]

  const playNext = () => {
    if (pressed || isPlaying) return

    setCurrentIndex((currentIndex + 1) % questions.length)
  }

  const play = () => {
    if (!currentQuestion) return
    if (pressed || isPlaying) return

    playAudio(currentQuestion.question_id)
  }

  return (
    <Page className="flex">
      <Navbar
        title="Interview - Question"
        left={
          <Link navbar onClick={() => navigate('/')}>
            Back
          </Link>
        }
        className="fixed top-0 z-10"
      />

      <Block>
        <Card
          header={`Question ID-${currentQuestion.question_id}`}
          footer={currentQuestion.category}
          headerDivider
          footerDivider
          raised
          className="mt-8"
        >
          <div className="text-2xl">{currentQuestion.question}</div>
        </Card>
        <div className="text-center">
          <Chip>
            {currentIndex + 1} / {questions.length}
          </Chip>
        </div>
      </Block>

      <Tabbar className="left-0 bottom-0 fixed">
        <TabbarLink
          icon="🔊"
          label="Replay"
          active={!isPlaying && !pressed}
          onClick={play}
          className={`${isPlaying ? 'opacity-50' : ''}`}
        />
        <TabbarLink
          icon="⏭️"
          label="Next"
          active={!isPlaying && !pressed}
          onClick={playNext}
          className={`${isPlaying ? 'opacity-50' : ''}`}
        />
      </Tabbar>
    </Page>
  )
}
