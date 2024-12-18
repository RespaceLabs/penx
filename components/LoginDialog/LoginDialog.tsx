'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { GoogleOauthButton } from '../GoogleOauthButton'
import { WalletConnectButton } from '../WalletConnectButton'
import { LoginForm } from './LoginForm'
import { useLoginDialog } from './useLoginDialog'

interface Props {}

export function LoginDialog({}: Props) {
  const { isOpen, setIsOpen } = useLoginDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Login</DialogTitle>
          <DialogDescription>Login to write post</DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {/* <div className="text-foreground/40">Web2 login</div> */}
          <GoogleOauthButton
            variant="outline"
            size="lg"
            className="w-full border-foreground"
          />
        </div>

        <div className="space-y-1">
          {/* <div className="text-foreground/40">Wallet login</div> */}
          <WalletConnectButton
            size="lg"
            className="w-full border-foreground"
            variant="outline"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <span className="i-[token--ethm] w-6 h-5"></span>
            <span>Wallet login </span>
          </WalletConnectButton>
        </div>
        <div className="text-center text-foreground/40">or</div>
        <LoginForm />

        {/* <Separator /> */}
      </DialogContent>
    </Dialog>
  )
}
