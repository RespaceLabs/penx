import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { precision } from '@/lib/math'
import { useAccount } from 'wagmi'

export function EthBalance() {
  const { address = '' } = useAccount()
  const { data } = useQueryEthBalance()

  if (!address || !data) return null

  return (
    <div className="space-y-1">
      <div className="text-foreground/60">ETH Balance</div>
      <div className="text-2xl font-bold">
        {typeof data !== 'undefined' &&
          `${precision.toDecimal(data.value).toFixed(5)}`}
      </div>
    </div>
  )
}
