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
  content: z.string().min(1, {
    message: 'Comment cannot be empty.',
  }),
})

interface Props {
  postId: string
  refetchComments: () => void
}

export function CommentInput({ postId, refetchComments }: Props) {
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
      })
      setContent('')
      refetchComments()
      toast.success('Comment submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit comment.')
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full"
      />
      <div className="flex justify-end">
        {!authenticated ? (
          <WalletConnectButton className="w-30">
            Log in to comment
          </WalletConnectButton>
        ) : (
          <Button onClick={handleSubmit} className="w-25">
            {isPending ? <LoadingDots /> : <p>Comment</p>}
          </Button>
        )}
      </div>
    </div>
  )
}
