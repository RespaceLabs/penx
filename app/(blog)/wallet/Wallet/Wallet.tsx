'use client'

import { ExportPrivateKey } from './ExportPrivateKey'
import { WalletInfo } from './WalletInfo'

export function Wallet() {
  return (
    <div>
      <WalletInfo />
      <ExportPrivateKey />
    </div>
  )
}
