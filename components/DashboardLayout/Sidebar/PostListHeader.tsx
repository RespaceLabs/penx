import { useSpaces } from '@/hooks/useSpaces'
import { useSession } from 'next-auth/react'
import { CreatePostButton } from './CreatePostButton'

export function PostListHeader() {
  const { space } = useSpaces()
  const { data } = useSession()
  return (
    <div className="flex justify-between items-center gap-2 mt-4">
      <div className="text-sm text-neutral-500">Posts</div>
      {space.userId === data?.userId && <CreatePostButton />}
    </div>
  )
}
