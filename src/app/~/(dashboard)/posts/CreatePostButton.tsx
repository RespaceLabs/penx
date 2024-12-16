'use client'

import { useState } from 'react'
import { editorDefaultValue } from '@/app/(creator-fi)/constants'
import LoadingCircle from '@/components/icons/loading-circle'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { loadPost } from '@/hooks/usePost'
import { api } from '@/lib/trpc'
import { PostType } from '@prisma/client'
import { Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreatePostButton() {
  const { push } = useRouter()
  const [isLoading, setLoading] = useState(false)
  async function createPost() {
    setLoading(true)
    try {
      const post = await api.post.create.mutate({
        type: PostType.ARTICLE,
        title: '',
        content: JSON.stringify(editorDefaultValue),
      })
      await loadPost(post.id)
      push(`/~/post/${post.id}`)
    } catch (error) {
      toast.error('Failed to create post')
    }
    setLoading(false)
  }
  return (
    <Button
      className="w-24 flex gap-1"
      disabled={isLoading}
      onClick={createPost}
    >
      {isLoading ? <LoadingCircle></LoadingCircle> : <Pen size={16}></Pen>}
      <span>Write</span>
    </Button>
  )
}
