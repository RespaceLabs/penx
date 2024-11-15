'use client'

import LoadingDots from "@/components/icons/loading-dots"
import { CommentInput } from "./CommentInput"
import { trpc } from '@/lib/trpc'
import { UserAvatar } from "@/components/UserAvatar"

interface Props {
  postId: string
}

export function Comments({ postId }: Props) {
  const { data: comments = [], isLoading, refetch } = trpc.comment.listByPostId.useQuery(postId)

  return (
    <div className="sm:px-6 xl:px-4 flex-col lg:max-w-3xl mx-auto px-0" >
      <div>
        <CommentInput refetchComments={refetch} postId={postId} />
      </div>
      <div>
        <div className="mt-6">
          {isLoading ? (
            <LoadingDots />
          ) : (
            comments?.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 my-2 bg-white rounded shadow">

                  <div className="flex items-center">
                    <UserAvatar address={comment.user.address as string} className="h-6 w-6" />
                    <p className="ml-1 text-sm text-gray-600"> {comment.user?.address} </p>
                  </div>
                  <p className="mt-2 ml-1">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  )
}
