import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function LoginButton() {
  const { push } = useRouter()
  return (
    <Button asChild variant="secondary">
      <Link href="/login">Sign in</Link>
    </Button>
  )
}
