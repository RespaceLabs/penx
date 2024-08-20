'use client'

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { MessagePanel } from './MessagePanel'
import { SendMessagePanel } from './SendMessagePanel'

export default function Page() {
  const { data: session } = useSession()
  const params = useParams()

  if (!params?.channelId || !session) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">Please select a channel</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100%] w-full bg-white">
      <MessagePanel channelId={params.channelId as string} />

      <SendMessagePanel
        channelId={params.channelId as string}
        userId={session.userId}
      />
    </div>
  )
}
