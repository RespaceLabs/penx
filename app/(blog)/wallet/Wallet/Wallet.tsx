'use client'

import { useSiteContext } from '@/components/SiteContext'
import { AuthType } from '@prisma/client'
import { EthBalance } from './EthBalance'
import { ExportPrivateKey } from './ExportPrivateKey'
import { TreeBalance } from './TreeBalance'
import { WalletInfo } from './WalletInfo'

export function Wallet() {
  const { authType } = useSiteContext()
  return (
    <div className="space-y-5">
      <WalletInfo />
      <EthBalance />
      <TreeBalance />
      {authType === AuthType.PRIVY && <ExportPrivateKey />}
    </div>
  )
}
