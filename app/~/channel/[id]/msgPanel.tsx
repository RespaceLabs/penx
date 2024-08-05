import { useMessages, IMessage } from "@/hooks/useMessages";
import { trpc } from "@/lib/trpc"
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "./userAvatar";
import { useThrottledCallback } from "use-debounce";
import { toast } from "sonner";

interface Props {
  channelId: string
  userId: string
  address: string
}

export const MsgPanel = ({ channelId, userId, address }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getMessagesState, addMessages } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPending, mutateAsync } = trpc.message.getMsgsByChannelId.useMutation()
  const [pageCount, setPageCount] = useState<number>(1);
  const { messages, currentPage, isNew } = getMessagesState(channelId)

  const fetchMessages = async (channelId: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const res = await mutateAsync({ channelId, page })
      addMessages(channelId, [...res.messages.reverse() as IMessage[]], res.currentPage, page === 1);
      if (page === 1) {
        setPageCount(res.pageCount)
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = useThrottledCallback(() => {
    const container = containerRef.current;
    if (!container) return

    if (container.scrollTop === 0) {
      if (currentPage < pageCount) {
        fetchMessages(channelId, currentPage + 1);
      } else {
        messages.length > 20 && toast.warning('There are no more new messages')
      }
    }
  }, 800);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!messages.length) {
      fetchMessages(channelId)
    }
  }, [channelId])

  useEffect(() => {
    if (messages.length > 4 && isNew) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // console.log('%c=render:', 'color:red', getMessagesState(channelId))

  return (
    <div ref={containerRef} className="flex-grow overflow-y-auto bg-gray-50 p-4">
      {messages.length ? <div className="flex flex-col p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start space-x-2">
              {msg.fromId !== userId && (
                <UserAvatar
                  image={msg.fromUser.image}
                  name={msg.fromUser.name}
                  address={address}
                />
              )}
              <div className="flex flex-col space-y-1">
                <div className={`text-xs text-gray-500 ${msg.fromId === userId ? 'text-right' : 'text-left'}`}>
                  <span className="inline-block max-w-[60px] truncate align-bottom">
                    {msg.fromUser.name || address}
                  </span>&nbsp; • &nbsp;{new Date(msg.createdAt).toLocaleString()}
                </div>
                <div className={`flex ${msg.fromId === userId ? 'justify-end' : 'justify-start'} items-center`}>
                  {msg.status !== 1 && ( // If not succeeded, show status indicator
                    <div className="flex items-center mr-2">
                      {msg.status === 2 && ( // Send Fail
                        <div className="flex items-center space-x-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <span className="text-red-500 text-xs">failed</span>
                        </div>
                      )}
                      {msg.status === 3 && ( // Sending
                        <div className="flex items-center space-x-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`relative p-3 rounded-lg max-w-[80%] ${msg.fromId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} break-words`}>
                    <div>{msg.content}</div>
                  </div>
                </div>
              </div>
              {msg.fromId === userId && (
                <UserAvatar
                  image={msg.fromUser.image}
                  name={msg.fromUser.name}
                  address={address}
                />
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div> : <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">{isLoading? "Loading..." :"No messages yet"}</span>
      </div>
      }
    </div>
  );
};