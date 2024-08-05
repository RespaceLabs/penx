import { Button } from "@/components/ui/button";
import { ContentType } from "@/hooks/useMessages";
import { SocketConnector } from "@/lib/socket/socketConnector";
import { nanoid } from "nanoid";
import { ChangeEvent, KeyboardEvent, useState, useCallback } from "react";
import { toast } from "sonner";

interface Props {
  userId: string
  channelId: string
  userName: string
  userImage: string
}

export const SendPanel = ({ userId, channelId, userImage, userName }: Props) => {
  const [msgContent, setMsgContent] = useState<string>("");
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const onSend = useCallback(async () => {
    if (userId && channelId && msgContent) {
      const instance = SocketConnector.getInstance()
      if (instance) {
        const isOk = await instance.sendChannelMessage({
          updateId: nanoid(),
          channelId,
          content: msgContent.trim(),
          uid: userId,
          userName,
          userImage,
          contentType: ContentType.TEXT
        })

        setMsgContent('')
        // console.log('%c=isOK ?????', 'color:red', isOk)
      } else {
        console.error('SocketConnector not init')
        toast.error('Connector not init')
      }
    }
  }, [channelId, msgContent, userId])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      onSend();
    }
  }, [isComposing, onSend]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="mt-4 flex">
      <input
        type="text"
        placeholder="Enter message..."
        className="w-full p-2 border border-gray-300 rounded"
        value={msgContent}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMsgContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      <Button
        className="w-[120px] h-[58px] ml-[10px]"
        onClick={() => onSend()}
      >
        Send
      </Button>
    </div>
  );
};
