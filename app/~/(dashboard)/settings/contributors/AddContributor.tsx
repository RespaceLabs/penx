import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'

export default function AddContributor() {
  const [q, setQ] = useState('')
  const { refetch } = trpc.user.contributors.useQuery()
  const { mutateAsync, isPending } = trpc.user.addContributor.useMutation()

  const add = async () => {
    if (!q.trim()) return toast.error('Please enter a valid address or email')
    try {
      await mutateAsync({ q })
      refetch()
      toast.success('Add contributor successfully')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          placeholder="Enter wallet address or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button disabled={isPending || !q} onClick={add}>
          {isPending ? <LoadingDots /> : 'Add'}
        </Button>
      </div>
    </div>
  )
}
