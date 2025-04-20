import { useState } from 'react'

export default function Question() {
  const [voz, setVoz] = useState(0)
  const pregunta = '¿Cuál es la capital de Francia?'
  const voces = [
    window.speechSynthesis.getVoices()[0],
    window.speechSynthesis.getVoices()[1],
    window.speechSynthesis.getVoices()[2]
  ]

  const reproducir = () => {
    const utter = new window.SpeechSynthesisUtterance(pregunta)
    if (voces[voz]) utter.voice = voces[voz]
    window.speechSynthesis.speak(utter)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="mb-4 text-2xl font-bold">{pregunta}</div>
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
          onClick={() => {
            /* lógica para siguiente pregunta */
          }}
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
    </div>
  )
}
