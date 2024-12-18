import { useLoginDialog } from './LoginDialog/useLoginDialog'
import { Button } from './ui/button'

export default function LoginButton() {
  const { setIsOpen } = useLoginDialog()
  return (
    <Button
      variant="secondary"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      Sign in
    </Button>
  )
}
