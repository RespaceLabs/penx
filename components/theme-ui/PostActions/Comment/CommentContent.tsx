'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'
import { getUserName } from '@/lib/utils'
import { User } from '@/server/db/schema'
import { format } from 'date-fns'
import { ArrowRight } from 'lucide-react'
import { CommentInput } from './CommentInput'

interface IParent extends Comment {
  user: User
}

interface Props {
  postId: string
}

export function CommentContent({ postId }: Props) {
  const {
    data: comments = [],
    isLoading,
    refetch,
  } = trpc.comment.listByPostId.useQuery(postId)
  const [showReplyInput, setShowReplyInput] = useState<string>('')

  return (
    <div className="flex-col">
      <div>
        <CommentInput refetchComments={refetch} postId={postId} />
      </div>
      <div>
        <div className="mt-6">
          {isLoading ? (
            <LoadingDots />
          ) : comments?.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="my-4 bg-background rounded flex flex-col"
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      image={comment.user.image || ''}
                      address={comment.user.displayName as string}
                      className="h-5 w-5"
                    />
                    <div className="text-sm text-foreground/80">
                      {getUserName(comment.user as any)}
                    </div>
                  </div>
                  {comment.parent && (
                    <div className="flex items-center gap-1">
                      <ArrowRight
                        size={12}
                        className="text-foreground/50"
                      ></ArrowRight>
                      <div className="flex items-center gap-1">
                        {/* <UserAvatar
                          image={comment.parent.user.image || ''}
                          address={comment.parent.user.displayName as string}
                          className="h-5 w-5"
                        /> */}
                        <div className="text-sm text-foreground/80">
                          {getUserName(comment.parent.user as any)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-1">{comment.content}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-foreground/50">
                    {format(new Date(comment.createdAt), 'yyyy-MM-dd')}
                  </div>

                  <button
                    className="cursor-pointer text-xs hover:underline text-foreground/50"
                    onClick={() =>
                      setShowReplyInput(showReplyInput ? '' : comment.id)
                    }
                  >
                    Reply
                  </button>
                </div>

                {showReplyInput === comment.id && (
                  <CommentInput
                    postId={comment.postId}
                    refetchComments={refetch}
                    parentId={comment.id}
                    onCancel={() => {
                      setShowReplyInput('')
                    }}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
