'use client'

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Post } from '@/hooks/usePost'
import { trpc } from '@/lib/trpc'
import { useDebouncedCallback } from 'use-debounce'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { ImageCreationUpload } from './ImageCreationUpload'

export function ImageCreation({ post }: { post: Post }) {
  const [data, setData] = useState<Post>(post)
  const { isPending, mutateAsync } = trpc.post.update.useMutation()

  const debounced = useDebouncedCallback(
    async (value: Post) => {
      if (data.content !== post.content || data.title !== post.title) {
        try {
          await mutateAsync({
            id: post.id,
            title: value.title,
            content: value.content as any,
            description: value.description,
          })
        } catch (error) {}
      }
    },
    // delay in ms
    400,
  )

  useEffect(() => {
    debounced(data)
  }, [data, debounced])

  return (
    <div className="w-full">
      <div className="relative min-h-[500px] max-w-screen-lg p-12 px-8 mx-auto z-0 md:w-[800px] sm:w-full">
        <div className="mb-5 flex flex-col space-y-3 pb-5">
          <input
            type="text"
            placeholder="Title"
            defaultValue={post?.title || ''}
            autoFocus
            onChange={(e) => {
              setData({ ...data, title: e.target.value })
            }}
            className="dark:placeholder-text-600 border-none px-0 font-cal text-4xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white disabled:bg-transparent"
          />
          <TextareaAutosize
            placeholder="Description"
            defaultValue={post?.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
          />
        </div>
        <div className="mb-8">
          <ProfileAvatar showAddress />
        </div>

        <ImageCreationUpload post={data} />
      </div>
    </div>
  )
}
