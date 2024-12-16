import { Separator } from '@/components/ui/separator'
import { GoogleBackupButton } from './GoogleBackupButton'
import { PullButton } from './PullButton'
import { PushButton } from './PushButton'
import { SyncButton } from './SyncButton'

interface Props {}

export function SyncBar({}: Props) {
  return (
    <div className="border-t flex h-10 text-xs text-foreground/60">
      {/* <PushButton /> */}
      {/* <PullButton /> */}
      <SyncButton />
      <GoogleBackupButton />
    </div>
  )
}
