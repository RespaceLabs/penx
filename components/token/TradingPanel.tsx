'use client'

import { useAccount } from 'wagmi'
import { WalletConnectButton } from '../WalletConnectButton'
import { Transaction } from './Transaction'

export const TradingPanel = () => {

  return (
    <div className="w-1/3 min-w-[500px] max-w-[610px] grid gap-4 h-fit bg-white p-6 rounded-xl">
      <Transaction />
    </div>
  )
}
