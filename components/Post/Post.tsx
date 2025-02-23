'use client'

import { useEffect, useMemo, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { appEmitter } from '@/lib/app-emitter'
import { editorDefaultValue } from '@/lib/constants'
import { Post as IPost, usePost } from '@/lib/hooks/usePost'
import { usePostSaving } from '@/lib/hooks/usePostSaving'
import { useSiteTags } from '@/lib/hooks/useSiteTags'
import { trpc } from '@/lib/trpc'
import { PostType } from '@/lib/types'
import { isValidUUIDv4 } from '@/lib/utils'
import { PlateEditor } from '../editor/plate-editor'
import { CoverUpload } from './CoverUpload'
import { JournalNav } from './JournalNav'
import { Tags } from './Tags'

export function Post() {
  const params = useSearchParams()
  const id = params?.get('id') || ''
  const { mutateAsync } = trpc.post.update.useMutation()
  const { setPostSaving } = usePostSaving()
  // console.log('post==============:', post)
  const {
    post,
    title,
    description,
    content,
    updateTitle,
    updateDescription,
    updateContent,
  } = usePost()

  useSiteTags()

  const isJournal = useMemo(() => {
    return !isValidUUIDv4(id)
  }, [id])
  const isToday = id === 'today'

  const journalTitle = useMemo(() => {
    if (!isJournal) return ''
    if (isToday) return 'Today, ' + format(new Date(Date.now()), 'LLL do')
    const formattedDate = format(new Date(id || Date.now()), 'LLL do')
    return formattedDate
  }, [isJournal, isToday, id])

  const debouncedUpdate = useDebouncedCallback(
    async (value: IPost) => {
      setPostSaving(true)
      try {
        await mutateAsync({
          id: value.id,
          title: value.title!,
          content: value.content,
          description: value.description!,
        })
      } catch (error) {}
      setPostSaving(false)
    },
    // delay in ms
    200,
  )

  return (
    <div className="w-full h-full">
      <div className="relative min-h-[500px] max-w-screen-lg p-12 px-8 mx-auto z-0">
        {post.type === PostType.ARTICLE && (
          <div className="mb-5 flex flex-col space-y-3 ">
            <CoverUpload post={post} />
            {isJournal && (
              <div className="flex items-center gap-4">
                <span className="text-foreground text-4xl font-bold">
                  {journalTitle}
                </span>
                <JournalNav date={post.date!} />
              </div>
            )}

            {!isJournal && (
              <TextareaAutosize
                className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
                placeholder="Title"
                value={title || ''}
                autoFocus
                onChange={(e) => {
                  const newPost = updateTitle(e.target.value)
                  debouncedUpdate(newPost)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                  }
                }}
              />
            )}
            <TextareaAutosize
              className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 bg-transparent"
              placeholder="Description"
              value={description}
              onChange={(e) => {
                const newPost = updateDescription(e.target.value)
                debouncedUpdate(newPost)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
            />
          </div>
        )}

        {!post.isPage && (
          <div className="flex items-center justify-between">
            <Tags />
          </div>
        )}

        <PlateEditor
          className="w-full -mx-6"
          value={content ? JSON.parse(content) : editorDefaultValue}
          showAddButton
          onChange={(v) => {
            const newPost = updateContent(JSON.stringify(v))
            debouncedUpdate(newPost)
          }}
        />
      </div>
    </div>
  )
}
