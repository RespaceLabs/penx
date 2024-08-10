'use client'

import { useEffect, useState } from 'react'
import Editor from '@/components/editor/advanced-editor'
import { PostWithSpace } from '@/hooks/usePost'
import { updatePostTitleById } from '@/hooks/usePosts'
import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'
import { useDebouncedCallback } from 'use-debounce'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { CoverUpload } from './CoverUpload'
import { defaultValue } from './default-value'
import { PostHeader } from './PostHeader'

export function Post({
  post,
  isPostLoading,
}: {
  post: PostWithSpace
  isPostLoading: boolean
}) {
  const [data, setData] = useState<PostWithSpace>(post)
  const { isPending, mutateAsync } = trpc.post.update.useMutation()
  const { data: session } = useSession()

  const debounced = useDebouncedCallback(
    async (value: PostWithSpace) => {
      if (data.content !== post.content || data.title !== post.title) {
        try {
          await mutateAsync({
            id: post.id,
            title: value.title,
            content: value.content,
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
      <PostHeader post={data} setData={setData} isSaving={isPending} />
      <div className="relative min-h-[500px] max-w-screen-lg p-12 px-8 mx-auto z-0 md:w-[800px] sm:w-full">
        <div className="mb-5 flex flex-col space-y-3 pb-5">
          <CoverUpload post={data} />
          <input
            type="text"
            placeholder="Title"
            defaultValue={post?.title || ''}
            autoFocus
            disabled={session?.userId !== post.space.userId}
            onChange={(e) => {
              setData({ ...data, title: e.target.value })
              updatePostTitleById(post.id, e.target.value)
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
        <div className="mb-8">
          <ProfileAvatar showEnsName showAddress />
        </div>

        <Editor
          initialValue={data.content ? JSON.parse(data.content) : defaultValue}
          editable={session?.userId === post?.space?.userId}
          onChange={(v) => {
            setData({ ...data, content: JSON.stringify(v) })
          }}
        />
      </div>
    </div>
  )
}
