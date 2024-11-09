import LoadingDots from '@/components/icons/loading-dots'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api, trpc } from '@/lib/trpc'
import { GoogleInfo } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { UnplugIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { restoreFromGoogleDrive } from '../lib/restoreFromGoogleDrive'
import { syncToGoogleDrive } from '../lib/syncToGoogleDrive'

interface Props {
  data: GoogleInfo
  refetch: () => void
}

export function GoogleBackupConnected({ data, refetch }: Props) {
  const { mutateAsync, isPending } =
    trpc.google.disconnectGoogleDrive.useMutation()
  const { data: session } = useSession()

  const { mutateAsync: backup, isPending: isBackupPending } = useMutation({
    mutationKey: ['google_backup'],
    mutationFn: async () => {
      return syncToGoogleDrive(data.access_token, session?.userId!)
    },
  })

  const { mutateAsync: restore, isPending: isRestorePending } = useMutation({
    mutationKey: ['google_restore'],
    mutationFn: async () => {
      return restoreFromGoogleDrive(data.access_token, session?.userId!)
    },
  })

  return (
    <div className="flex flex-col gap-6">
      {data.email && (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={data?.picture || ''} />
          </Avatar>
          <div>{data.email}</div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="w-40 gap-1"
          disabled={isBackupPending}
          onClick={async () => {
            try {
              await backup()
              toast.success('Backup successful')
            } catch (error) {
              toast.error('Failed to backup to Google Drive')
            }
          }}
        >
          {isBackupPending ? (
            <>
              <div>Backup</div>
              <LoadingDots className="bg-foreground/60" />
            </>
          ) : (
            'Backup manually'
          )}
        </Button>

        <Button
          className="flex gap-1 w-52"
          onClick={async () => {
            try {
              await restore()
              toast.success('Restore successful')
            } catch (error) {
              toast.error('Failed to restore from Google Drive')
            }
          }}
        >
          {isRestorePending ? (
            <>
              <div>Restoring</div>
              <LoadingDots />
            </>
          ) : (
            <div>Restore from google drive</div>
          )}
        </Button>
      </div>

      <Separator />

      <div>
        <Button
          variant="destructive"
          className="h-14 rounded-2xl w-[300px]"
          disabled={isPending}
          onClick={async () => {
            await mutateAsync()
            refetch()
          }}
        >
          {isPending ? (
            <LoadingDots></LoadingDots>
          ) : (
            <>
              <UnplugIcon size={20} />

              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold leading-none">
                  Disconnect Google drive
                </div>
                <div className="text-xs opacity-60">
                  Disconnect to disable Google drive backup
                </div>
              </div>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
