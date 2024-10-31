import { Button } from '@/components/ui/button'
import {
  usePrivy,
  useSetWalletPassword,
  WalletWithMetadata,
} from '@privy-io/react-auth'

export function ExportPrivateKey() {
  const { ready, authenticated, user, exportWallet } = usePrivy()

  const { setWalletPassword } = useSetWalletPassword()

  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated

  if (!user || !isAuthenticated) return null

  const embeddedWallet = user.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' && account.walletClientType === 'privy',
  )

  const alreadyHasPassword = embeddedWallet?.recoveryMethod === 'user-passcode'

  return (
    <div className="mt-4">
      <div className="font-bold text-lg">
        <div>Embedded Wallet</div>
      </div>
      <div className="text-sm text-foreground/70">
        A user{`'`}s embedded wallet is theirs to keep, and even take with them.
      </div>

      <div className="space-x-2 mt-4">
        <Button
          // variant="outline"
          onClick={async () => {
            try {
              await setWalletPassword()
            } catch (error) {}
          }}
          disabled={!isAuthenticated || !embeddedWallet}
        >
          {/* Set a recovery password */}
          {!alreadyHasPassword
            ? 'Add a password to your wallet'
            : 'Reset the password on your wallet'}
        </Button>

        <Button
          // variant="outline"
          onClick={exportWallet}
          disabled={!isAuthenticated || !embeddedWallet}
        >
          Export address private key
        </Button>
      </div>
    </div>
  )
}
