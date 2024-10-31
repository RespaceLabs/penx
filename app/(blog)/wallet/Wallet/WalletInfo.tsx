import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { Copy } from 'lucide-react'
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
        <div className="text-foreground/60">Wallet</div>
        <div className="flex items-center gap-1 font-bold">
          <div>{address}</div>
          <div
            className="cursor-pointer inline-flex"
            onClick={() => {
              copy(address)
              toast.success('Copied to clipboard')
            }}
          >
            <Copy size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}
