import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { precision } from '@/lib/math'
import { Copy, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

export function WalletInfo() {
  const { address = '' } = useAccount()
  const { data } = useQueryEthBalance()
  const { copy } = useCopyToClipboard()

  if (!address || !data) return null

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-1 font-bold text-lg">
          {/* <Wallet size={20} /> */}
          <div>Wallet</div>
        </div>
        <div className="flex items-center gap-1">
          <div>{address}</div>
          <div
            onClick={() => {
              copy(address)
              toast.success('Copied to clipboard')
            }}
          >
            <Copy size={16} />
          </div>
        </div>
      </div>

      <div className="font-bold text-lg">
        <div className="">Balance</div>
        <div className="text-2xl font-bold">
          ETH{' '}
          {typeof data !== 'undefined' &&
            `${precision.toDecimal(data.value).toFixed(5)}`}
        </div>
      </div>
    </div>
  )
}
