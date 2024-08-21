import { useEffect, useRef, useState } from 'react'
import { IMessage, useMessages } from '@/hooks/useMessages'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import { useThrottledCallback } from 'use-debounce'
import { MessageItem } from './MessageItem'

interface Props {
  channelId: string
}

export const MessagePanel = ({ channelId }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const { getMessagesState, addMessages } = useMessages()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isPending, mutateAsync } = trpc.message.listByChannelId.useMutation()
  const [pageCount, setPageCount] = useState<number>(1)
  const { messages, currentPage, isNew } = getMessagesState(channelId)

  const fetchMessages = async (channelId: string, page: number = 1) => {
    setIsLoading(true)
    try {
      const res = await mutateAsync({ channelId, page })

      addMessages(
        channelId,
        [...(res.messages.reverse() as IMessage[])],
        res.currentPage,
        page === 1,
      )
      if (page === 1) {
        setPageCount(res.pageCount)
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = useThrottledCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (container.scrollTop === 0) {
      if (currentPage < pageCount) {
        fetchMessages(channelId, currentPage + 1)
      } else {
        messages.length > 20 && toast.warning('There are no more new messages')
      }
    }
  }, 800)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (!messages.length) {
      fetchMessages(channelId)
    }
  }, [channelId])

  useEffect(() => {
    if (messages.length > 4 && isNew) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div ref={containerRef} className="flex-grow overflow-y-auto">
      {messages.length ? (
        <div className="flex flex-col p-4 space-y-6">
          {messages.map((msg) => {
            return <MessageItem key={msg.id} message={msg} />
          })}

          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <span className="text-gray-500">
            {isLoading ? 'Loading...' : 'No messages yet'}
          </span>
        </div>
      )}
    </div>
  )
}
