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

interface ChanelItemProps {
  channel: Channel
}
export function ChannelItem({ channel }: ChanelItemProps) {
  const { push } = useRouter()
  const params = useParams()
  const isActive = params.id === channel.id

  return (
    <div
      className={cn(
        'flex items-center gap-2 hover:bg-sidebar py-[6px] px-2 rounded cursor-pointer -mx-2',
        isActive && 'bg-sidebar',
      )}
      onClick={async () => {
        push(`/~/channel/${channel.id}`)
      }}
    >
      <div className="inline-flex text-zinc-600">
        <Hash size={20} />
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
      if (!SocketConnector.getInstance()) {
        new SocketConnector(token, channelsId)
      }
    }
  }, [session, channels])

  return (
    <div className="flex flex-col justify-center gap-[1px]">
      {channels.map((item) => (
        <ChannelItem key={item.id} channel={item} />
      ))}
    </div>
  )
}
