import { CreateChannelDialog } from '@/components/CreateChannelDialog/CreateChannelDialog'
import { useSpaces } from '@/hooks/useSpaces'
import { useSession } from 'next-auth/react'

export function ChannelListHeader() {
  const { space } = useSpaces()
  const { data } = useSession()
  return (
    <div className="flex justify-between items-center gap-2 py-2">
      <div className="text-neutral-900 font-bold">Chat</div>
      {space.userId === data?.userId && <CreateChannelDialog />}
    </div>
  )
}
