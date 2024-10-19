'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { addPostTag, Post, removePostTag, usePost } from '@/hooks/usePost'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

function AllTags({ post }: { post: Post }) {
  const { data = [], isLoading } = trpc.tag.list.useQuery()
  const { mutateAsync } = trpc.tag.add.useMutation()
  if (isLoading) {
    return <div className="px-3 py-3 text-zinc-500 text-center">Loading...</div>
  }
  return (
    <>
      {data.map((item) => (
        <DropdownMenuItem
          key={item.id}
          onClick={async () => {
            const some = post.postTags.some(
              (postTag) => postTag.tag.id === item.id,
            )
            if (some) return
            try {
              const postTag = await mutateAsync({
                postId: post.id,
                tagId: item.id,
              })
              addPostTag(postTag)
            } catch (error) {
              toast.error(extractErrorMessage(error))
            }
          }}
          className="cursor-pointer py-2"
        >
          {item.name}
        </DropdownMenuItem>
      ))}
    </>
  )
}

export function Tags() {
  const { post } = usePost()
  const [value, setValue] = useState('')
  const { mutateAsync } = trpc.tag.create.useMutation()
  const { mutateAsync: deletePostTag } = trpc.tag.deletePostTag.useMutation()

  if (!post?.postTags) return null
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        {post.postTags.map((item) => (
          <Badge
            variant="secondary"
            key={item.id}
            className="rounded-full relative gap-1 text-xs"
            onClick={async () => {
              try {
                removePostTag(item)
                await deletePostTag(item.id)
              } catch (error) {
                toast.error(extractErrorMessage(error))
              }
            }}
          >
            <div>{item.tag.name}</div>
            <div className="inline-flex w-5 h-5 rounded-full hover:bg-zinc-500 hover:text-white items-center justify-center transition-colors cursor-pointer">
              <XIcon size={16} />
            </div>
          </Badge>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="xs"
            variant="outline"
            className="rounded-full gap-1 text-zinc-500 text-xs h-7 px-2"
          >
            <Plus size={16}></Plus>
            <div>Add tag</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-0">
          <div className="border-b">
            <Input
              size="sm"
              placeholder="Find or create"
              className="outline-none focus-visible:ring-0 border-none border-b"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  try {
                    const postTag = await mutateAsync({
                      postId: post.id,
                      name: value,
                    })

                    addPostTag(postTag)
                  } catch (error) {
                    const msg = extractErrorMessage(error)
                    toast.error(msg || 'Error adding tag')
                  }
                }
              }}
            />
          </div>
          <AllTags post={post} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
