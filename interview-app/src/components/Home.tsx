import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        className="rounded bg-blue-600 px-6 py-3 text-4xl font-bold text-white shadow transition hover:bg-blue-700"
        onClick={() => navigate('/question')}
      >
        Start
      </button>
    </div>
  )
}
