import { Separator } from '@/components/ui/separator'
import { GoogleBackupButton } from './GoogleBackupButton'
import { PullButton } from './PullButton'
import { PushButton } from './PushButton'

interface Props {}

export function SyncBar({}: Props) {
  return (
    <div className="border-t grid grid-cols-3 h-10 text-xs text-foreground/60">
      <PushButton />
      <PullButton />
      <GoogleBackupButton />
    </div>
  )
}
