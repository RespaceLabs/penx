'use client'

import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'
import { User } from '@prisma/client'
import { CommentInput } from './CommentInput'

interface IParent extends Comment {
  user: User
}

interface IReply {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  user: User
  parent?: IParent
  parentId: string
  postId: string
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

  const { isPending, mutateAsync: listRepliesByCommentId } =
    trpc.comment.listRepliesByCommentId.useMutation()
  const [showReplyInput, setShowReplyInput] = useState<string>('')
  const [showReplies, setShowReplies] = useState<string>('')
  const [replies, setReplies] = useState<IReply[]>([])

  const onReplies = async (
    commentId: string,
    replyCount: number,
    showReplies: string,
  ) => {
    if (!replyCount) {
      return
    }

    if (showReplies) {
      setShowReplies('')

      return
    }

    try {
      const data = await listRepliesByCommentId(commentId)
      setShowReplies(commentId)
      setReplies(data as unknown as IReply[])
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

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
              <div key={comment.id} className="my-2 bg-background rounded">
                <div className="flex items-center">
                  <UserAvatar
                    address={comment.user.email as string}
                    className="h-8 w-8"
                  />
                  <p className="ml-1 text-sm text-gray-600">
                    {comment.user?.displayName}
                  </p>
                </div>
                <p className="mt-2 ml-1">{comment.content}</p>
                <div className="flex justify-between mb-1 ml-1">
                  <button
                    className="cursor-pointer text-xs hover:underline"
                    onClick={() =>
                      onReplies(comment.id, comment.replyCount, showReplies)
                    }
                  >
                    {showReplies === comment.id
                      ? 'Hide replies'
                      : comment.replyCount +
                        (comment.replyCount > 1 ? ' replies' : ' reply')}
                  </button>
                  <button
                    className="cursor-pointer text-xs hover:underline"
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

                {replies.length > 0 && showReplies === comment.id && (
                  <div className="ml-6 mt-4 border-l border-gray-200 pl-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="mb-3">
                        <div className="flex items-center mb-1">
                          <UserAvatar
                            address={reply.user.image as string}
                            className="h-6 w-6"
                          />
                          <p className="ml-2 text-sm text-gray-600 font-bold">
                            {reply.user?.displayName}
                          </p>
                          {reply.parent?.user && (
                            <p className="ml-2 text-sm text-gray-400">
                              replied to &nbsp;
                              <span className="font-bold text-gray-500">
                                {reply.user?.displayName}
                              </span>
                            </p>
                          )}
                        </div>
                        <p className="ml-2 text-gray-700">{reply.content}</p>

                        <div className="flex justify-end">
                          <button
                            className="cursor-pointer text-xs hover:underline"
                            onClick={() =>
                              setShowReplyInput(showReplyInput ? '' : reply.id)
                            }
                          >
                            Reply
                          </button>
                        </div>

                        {showReplyInput === reply.id && (
                          <CommentInput
                            postId={comment.postId}
                            refetchComments={refetch}
                            parentId={reply.id}
                            onCancel={() => {
                              setShowReplyInput('')
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
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
