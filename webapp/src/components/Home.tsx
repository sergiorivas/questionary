import { useNavigate } from 'react-router-dom'
import { Page, Button, Block, Navbar } from 'konsta/react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Page className="safe-areas">
      <Navbar title="Interview - Home" />

      <Block
        strong
        inset
        className="flex flex-col items-center justify-center text-center"
      >
        <p className="mb-4">Welcome</p>
        <Button rounded large onClick={() => navigate('/question')}>
          Start
        </Button>
      </Block>
    </Page>
  )
}
