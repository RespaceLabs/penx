import { useEffect } from 'react'
import { useTokenContext } from '@/components/TokenContext'
import { Channel, useChannels } from '@/hooks/useChannels'
import { Post, postAtom } from '@/hooks/usePost'
import { postLoadingAtom } from '@/hooks/usePostLoading'
import { usePosts } from '@/hooks/usePosts'
import { SocketConnector } from '@/lib/socket/socketConnector'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { FileText, Hash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { ChannelListHeader } from './ChannelListHeader'

interface ChanelItemProps {
  channel: Channel
}
function ChannelItem({ channel }: ChanelItemProps) {
  const { push } = useRouter()
  const params = useParams()
  const isActive = params.id === channel.id

  return (
    <div
      className={cn(
        'flex items-center gap-2 hover:bg-sidebar py-[6px] px-2 rounded cursor-pointer',
        isActive && 'bg-sidebar',
      )}
      onClick={async () => {
        push(`/~/channel/${channel.id}`)
      }}
    >
      <div className="inline-flex text-zinc-600">
        <Hash size={16} />
      </div>
      <div className="text-sm">{channel.name}</div>
    </div>
  )
}

export function ChannelList() {
  const { channels } = useChannels()
  const { data: session } = useSession()
  const token = useTokenContext()

  useEffect(() => {
    if (session?.userId && channels.length) {
      const channelsId = channels.map((item) => item.id)
      const socketInstance = SocketConnector.getInstance()
      if (!socketInstance) {
        new SocketConnector(token, channelsId)
      } else {
        socketInstance.joinChannels(channelsId)
      }
    }

    return () => {
      const socketInstance = SocketConnector.getInstance()
      if (socketInstance) {
        socketInstance.leaveChannels(channels.map((item) => item.id))
      }
    }
  }, [session, channels])

  return (
    <div
      className="flex flex-col gap-[1px] w-[240px] sticky top-12 px-2"
      style={{
        height: 'calc(100vh - 48px)',
      }}
    >
      <ChannelListHeader />
      <div className="grid gap-1">
        {channels.map((item) => (
          <ChannelItem key={item.id} channel={item} />
        ))}
      </div>
    </div>
  )
}
