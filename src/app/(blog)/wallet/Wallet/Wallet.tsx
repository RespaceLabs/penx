'use client'

import { useSiteContext } from '@/components/SiteContext'
import { EthBalance } from './EthBalance'
import { PenBalance } from './PenBalance'
import { WalletInfo } from './WalletInfo'

export function Wallet() {
  const { authType } = useSiteContext()
  return (
    <div className="space-y-5">
      <WalletInfo />
      <EthBalance />
      <PenBalance />
      {/* {authType === AuthType.PRIVY && <ExportPrivateKey />} */}
    </div>
  )
}
