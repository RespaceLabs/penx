import { memo } from 'react'
import { UserAvatar } from '@/components/UserAvatar'
import { useMembers } from '@/hooks/useMembers'
import { IMessage } from '@/hooks/useMessages'
import { useSpaces } from '@/hooks/useSpaces'
import { shortenAddress } from '@/lib/utils'
import { Member, User } from '@prisma/client'

// type MemberWithUser = Member & {
//   user: {
//     name: string | null
//     ensName: string | null
//     email: string | null
//     address: string
//   }
// }

interface Props {
  message: IMessage
}

export const MessageItem = memo(function MessageItem({
  message: message,
}: Props) {
  const { space } = useSpaces()
  const { members = [] } = useMembers(space.id)

  function getUser(userId: string) {
    const member = members.find((m) => m.userId === userId)
    return member ? member.user : null
  }
  const user = getUser(message.userId)

  return (
    <div className={`flex`}>
      <div className="flex items-start space-x-2">
        <UserAvatar user={{ ...user } as User} />

        <div className="flex flex-col space-y-1">
          <div className="flex gap-2">
            <div className="font-semibold text-sm text-black">
              {user?.name || user?.ensName || shortenAddress(user?.address)}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
          <div className={`flex items-center`}>
            {message.status !== 1 && ( // If not succeeded, show status indicator
              <div className="flex items-center mr-2">
                {message.status === 2 && ( // Send Fail
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="text-red-500 text-xs">failed</span>
                  </div>
                )}
                {message.status === 3 && ( // Sending
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                )}
              </div>
            )}

            <div>{message.content}</div>
          </div>
        </div>
      </div>
    </div>
  )
})
