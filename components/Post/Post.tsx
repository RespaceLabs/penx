'use client'

import { useEffect, useState } from 'react'
import Editor from '@/components/editor/advanced-editor'
import { Post as PostType } from '@/hooks/usePost'
import { usePostSaving } from '@/hooks/usePostSaving'
import { trpc } from '@/lib/trpc'
import { useDebouncedCallback } from 'use-debounce'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { CoverUpload } from './CoverUpload'
import { defaultValue } from './default-value'
import { Tags } from './Tags'

export function Post({ post }: { post: PostType }) {
  const [data, setData] = useState<PostType>(post)
  const { mutateAsync } = trpc.post.update.useMutation()
  const { setPostSaving } = usePostSaving()

  const debounced = useDebouncedCallback(
    async (value: PostType) => {
      if (data.content !== post.content || data.title !== post.title) {
        setPostSaving(true)

        try {
          await mutateAsync({
            id: post.id,
            title: value.title,
            content: value.content,
            description: value.description,
          })
        } catch (error) {}
        setPostSaving(false)
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
        <div className="mb-5 flex flex-col space-y-3 ">
          <CoverUpload post={data} />
          <input
            type="text"
            placeholder="Title"
            defaultValue={post?.title || ''}
            autoFocus
            onChange={(e) => {
              setData({ ...data, title: e.target.value })
              // TODO:
            }}
            className="dark:placeholder-text-600 border-none px-0 font-cal text-4xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white disabled:bg-transparent"
          />
          {/* <TextareaAutosize
          placeholder="Description"
          defaultValue={post?.description || ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        /> */}
        </div>
        <div className="mb-8 space-y-2">
          <ProfileAvatar showEnsName showAddress />
          <Tags />
        </div>

        <Editor
          initialValue={data.content ? JSON.parse(data.content) : defaultValue}
          onChange={(v) => {
            setData({ ...data, content: JSON.stringify(v) })
          }}
        />
      </div>
    </div>
  )
}
