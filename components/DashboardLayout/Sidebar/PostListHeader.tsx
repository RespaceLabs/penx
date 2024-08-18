import { NewButton } from '@/components/Navbar/NewButton'
import { useSpace } from '@/hooks/useSpace'
import { useSession } from 'next-auth/react'

export function PostListHeader() {
  const { space } = useSpace()
  const { data } = useSession()
  return (
    <div className="flex justify-between items-center gap-2 py-2">
      <div className="text-neutral-900 font-bold">Posts</div>
      {space.userId === data?.userId && <NewButton />}
    </div>
  )
}
