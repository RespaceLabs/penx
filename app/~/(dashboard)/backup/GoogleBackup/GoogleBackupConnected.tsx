import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/trpc'
import { GoogleInfo } from '@/lib/types'
import { UnplugIcon } from 'lucide-react'

interface Props {
  data: GoogleInfo
  refetch: () => void
}

export function GoogleBackupConnected({ data, refetch }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={data?.picture || ''} />
        </Avatar>
        <div>{data.email}</div>
      </div>
      <div>
        <Button
          variant="destructive"
          className="h-14 rounded-2xl "
          onClick={async () => {
            await api.google.disconnectGoogleDrive.mutate()
            refetch()
          }}
        >
          <UnplugIcon size={20} />

          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold leading-none">
              Disconnect Google drive
            </div>
            <div className="text-xs opacity-60">
              Disconnect to disable Google drive backup
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}
