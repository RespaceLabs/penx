import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ContentType } from '@/hooks/useMessages'
import { useSpaces } from '@/hooks/useSpaces'
import { SocketConnector } from '@/lib/socket/socketConnector'
import { SendIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

interface Props {
  userId: string
  channelId: string
}

export const SendMessagePanel = ({ userId, channelId }: Props) => {
  const { space } = useSpaces()
  const [msgContent, setMsgContent] = useState<string>('')
  const [isComposing, setIsComposing] = useState<boolean>(false)

  const onSend = useCallback(async () => {
    if (userId && channelId && msgContent) {
      const instance = SocketConnector.getInstance()
      if (instance) {
        const isOk = await instance.sendChannelMessage({
          updateId: nanoid(),
          channelId,
          spaceId: space.id,
          content: msgContent.trim(),
          uid: userId,
          contentType: ContentType.TEXT,
        })

        setMsgContent('')
        // console.log('%c=isOK ?????', 'color:red', isOk)
      } else {
        console.error('SocketConnector not init')
        toast.error('Connector not init')
      }
    }
  }, [channelId, msgContent, userId])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isComposing) {
        e.preventDefault()
        onSend()
      }
    },
    [isComposing, onSend],
  )

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className="mt-4 flex items-center sticky bottom-0 pb-2 bg-white">
      <Input
        type="text"
        placeholder="Send message..."
        className="w-full h-12 pr-8 pl-4 bg-neutral-100 rounded-full flex items-center border-none"
        value={msgContent}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setMsgContent(e.target.value)
        }
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      <Button
        // variant="ghost"
        size="icon"
        className="absolute right-2 top-1 rounded-full"
        onClick={() => onSend()}
      >
        <SendIcon size={18} />
      </Button>
    </div>
  )
}
