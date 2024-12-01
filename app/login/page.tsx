import { GoogleOauthButton } from '@/components/GoogleOauthButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { getSite } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { Lobster } from 'next/font/google'
import Link from 'next/link'

const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function Page() {
  const site = await getSite()

  return (
    <div className="h-screen flex flex-col items-center justify-between relative">
      <Link
        href="/"
        className={cn(
          'text-xl font-bold text-foreground/60 hover:text-foreground py-4 cursor-pointer z-20',
          lobster.className,
        )}
      >
        {site.name}
      </Link>
      <div className="flex-1 flex items-center justify-center w-full -mt-20 z-10">
        <Card className="flex flex-col sm:w-96">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login with Google or Web3 Wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              {/* <div className="text-foreground/40">Wallet login</div> */}
              <WalletConnectButton size="lg" className="w-full">
                <span className="i-[token--ethm] w-6 h-5"></span>
                <span>Wallet login </span>
              </WalletConnectButton>
            </div>
            {/* <Separator /> */}
            <div className="space-y-1">
              {/* <div className="text-foreground/40">Web2 login</div> */}
              <GoogleOauthButton
                variant="secondary"
                size="lg"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
