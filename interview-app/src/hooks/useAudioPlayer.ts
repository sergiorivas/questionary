import { Howl } from 'howler'
import { useState, useCallback } from 'react'

const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = useCallback((questionId: string) => {
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
  }, [])

  return { isPlaying, playAudio }
}

export default useAudioPlayer
