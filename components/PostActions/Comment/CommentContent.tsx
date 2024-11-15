'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'
import { CommentInput } from './CommentInput'

interface Props {
  postId: string
}

export function CommentContent({ postId }: Props) {
  const {
    data: comments = [],
    isLoading,
    refetch,
  } = trpc.comment.listByPostId.useQuery(postId)

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
              <div key={comment.id} className="my-2 bg-white rounded">
                <div className="flex items-center">
                  <UserAvatar
                    address={comment.user.address as string}
                    className="h-8 w-8"
                  />
                  <p className="ml-1 text-sm text-gray-600">
                    {' '}
                    {comment.user?.address}{' '}
                  </p>
                </div>
                <p className="mt-2 ml-1">{comment.content}</p>
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
