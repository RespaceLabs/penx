'use client'

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useDebouncedCallback } from 'use-debounce'
import { appEmitter } from '@/lib/app-emitter'
import { updatePost } from '@/lib/hooks/usePost'
import { usePostSaving } from '@/lib/hooks/usePostSaving'
import { useSiteTags } from '@/lib/hooks/useSiteTags'
import { trpc } from '@/lib/trpc'
import { uniqueId } from '@/lib/unique-id'
import { Post as PostType } from '@/server/db/schema'
import { PlateEditor } from '../editor/plate-editor'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { CoverUpload } from './CoverUpload'
import { Tags } from './Tags'

export function Post({ post }: { post: PostType }) {
  const [data, setData] = useState<PostType>(post)
  const { mutateAsync } = trpc.post.update.useMutation()
  const { setPostSaving } = usePostSaving()

  useSiteTags()

  const debounced = useDebouncedCallback(
    async (value: PostType) => {
      if (data.content !== post.content || data.title !== post.title) {
        setPostSaving(true)

        try {
          await mutateAsync({
            id: data.id,
            title: value.title || '',
            content: value.content,
            description: value.description || '',
          })

          updatePost({
            id: data.id,
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
    <div className="w-full h-full">
      <div className="relative min-h-[500px] max-w-4xl py-4 sm:py-12 px-5 sm:px-8 mx-auto z-0">
        <div className="mb-5 flex flex-col space-y-3 ">
          <CoverUpload post={data} />
          <TextareaAutosize
            placeholder="Title"
            defaultValue={data?.title || ''}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                setTimeout(() => {
                  appEmitter.emit('KEY_DOWN_ENTER_ON_TITLE')
                }, 20)
              }
            }}
            onChange={(e) => {
              setData({ ...data, title: e.target.value })
            }}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
          />
          <TextareaAutosize
            placeholder="Description"
            defaultValue={post?.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>
        <div className="mb-4 space-y-2">
          <ProfileAvatar showName />
          <Tags />
        </div>

        <PlateEditor
          className="w-full -mx-6"
          showAddButton
          value={
            post.content
              ? JSON.parse(post.content)
              : [
                  {
                    id: uniqueId(),
                    type: 'p',
                    children: [{ text: '' }],
                  },
                ]
          }
          onChange={(v) => {
            setData({ ...data, content: JSON.stringify(v) })
          }}
        />
      </div>
    </div>
  )
}
