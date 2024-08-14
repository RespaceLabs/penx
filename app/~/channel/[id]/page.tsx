'use client'

import { useMemo } from 'react'
import { useChannels } from '@/hooks/useChannels'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { MessagePanel } from './MessagePanel'
import { SendMessagePanel } from './SendMessagePanel'

export default function Page() {
  const { data: session } = useSession()
  const params = useParams()

  if (!params.id || !session) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">Please select a channel</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100%] w-full bg-white">
      <MessagePanel channelId={params.id as string} />

      <SendMessagePanel
        channelId={params.id as string}
        userId={session.userId}
      />
    </div>
  )
}
