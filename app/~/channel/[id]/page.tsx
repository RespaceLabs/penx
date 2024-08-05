'use client'

import { useMemo } from 'react'
import { useChannels } from '@/hooks/useChannels'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { MsgPanel } from './msgPanel'
import { SendPanel } from './sendPanel'

export default function Page() {
  const { data: session } = useSession()
  const { channels } = useChannels()
  const params = useParams()

  const channelName = useMemo<string>(() => {
    const channel = channels.find((item) => item.id === params.id)

    if (channel) {
      return channel.name
    }

    return ''
  }, [channels, params.id])

  if (!params.id || !session) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">Please select a channel</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white p-4">
      <h2 className="text-lg font-bold mb-2">{channelName}</h2>

      <MsgPanel
        channelId={params.id as string}
        userId={session?.userId}
        address={session?.address}
      />

      <SendPanel
        channelId={params.id as string}
        userId={session.userId}
        userName={session.user?.name!}
        userImage={session.user?.image!}
      />
    </div>
  )
}
