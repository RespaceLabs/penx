import { useState } from 'react'
import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { z } from 'zod'

const CommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Comment cannot be empty.' })
    .max(1000, { message: 'Comment cannot exceed 1000 characters.' }),
})

interface Props {
  postId: string
  // For reply
  parentId?: string;
  refetchComments: () => void
  onCancel?: () => void
}

const maxCharacters = 1000

export function CommentInput({ postId, parentId, refetchComments, onCancel }: Props) {
  const userID = useAddress()
  const [content, setContent] = useState('')
  const { isPending, mutateAsync } = trpc.comment.create.useMutation()

  const { data: session } = useSession()
  const authenticated = !!session

  async function handleSubmit() {
    const result = CommentSchema.safeParse({ content })
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    if (!authenticated) {
      toast.error('You need to log in to comment.')

      return
    }

    try {
      await mutateAsync({
        postId,
        userId: userID as string,
        content,
        parentId
      })

      setContent('')
      onCancel && onCancel()
      refetchComments()
      toast.success('Comment submitted successfully!')
    } catch (error) {
      console.log('Failed to submit comment.', 'color:red', error)
      toast.error('Failed to submit comment.')
    }
  }

  return (
    <div>
      <Textarea
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={maxCharacters}
        className="w-full"
      />
      <div className="flex items-center justify-between text-sm mt-2 text-gray-500">
        <div>
          <span>
            {content.length}/{maxCharacters} characters
          </span>
        </div>

        <div className="flex justify-end">
          {
            parentId && <Button
              onClick={() => {
                setContent('')
                onCancel && onCancel()
              }}
              className="w-20 text-xs h-8 mr-1">
              <p>Cancel</p>
            </Button>
          }

          {!authenticated ? (
            <WalletConnectButton className="w-30 text-xs h-8">
              Log in to comment
            </WalletConnectButton>
          ) : (
            <Button onClick={handleSubmit} className="w-20 text-xs h-8">
              {isPending ? <LoadingDots /> : <p>Comment</p>}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
