import { GoogleOauthButton } from '@/components/GoogleOauthButton'
import { useSiteContext } from '@/components/SiteContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  PrivyConnectButton,
  ReownConnectButton,
  WalletConnectButton,
} from '@/components/WalletConnectButton'
import { AuthType } from '@prisma/client'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="flex flex-col sm:w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login with Google or Web3 Wallets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <div className="text-foreground/40">Wallet login</div>
            <ReownConnectButton size="lg" className="w-full">
              <span className="i-[token--ethm] w-6 h-5"></span>
              Login with Reown
            </ReownConnectButton>
            <PrivyConnectButton size="lg" className="w-full">
              <span className="i-[token--ethm] w-6 h-5"></span>
              Login with Privy
            </PrivyConnectButton>
          </div>
          <Separator />
          <div className="space-y-1">
            <div className="text-foreground/40">Web2 login</div>
            <GoogleOauthButton
              variant="secondary"
              size="lg"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
