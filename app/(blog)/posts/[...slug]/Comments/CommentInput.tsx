import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import LoadingDots from '@/components/icons/loading-dots'
import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc'
import { z } from 'zod'
import { useSession } from "next-auth/react"
import { WalletConnectButton } from '@/components/WalletConnectButton'

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
      <div>

        {!authenticated ? <WalletConnectButton className="w-30">
          Log in to comment
        </WalletConnectButton> : <Button size="lg" onClick={handleSubmit} className="w-25">
          {isPending ? <LoadingDots /> : <p>Leave a Comment</p>}
        </Button>
        }
      </div>
    </div>
  )
}
