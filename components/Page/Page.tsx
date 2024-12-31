'use client'

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { appEmitter } from '@/lib/app-emitter'
import { PageData, updatePage, usePage } from '@/lib/hooks/usePage'
import { pageToSlate } from '@/lib/serializer/pageToSlate'
import { trpc } from '@/lib/trpc'
import { useDebouncedCallback } from 'use-debounce'
import { PlateEditor } from '../editor/plate-editor'
import { CoverUpload } from './CoverUpload'

export function Page() {
  const { page } = usePage()
  const [data, setData] = useState<PageData>(page!)
  const { mutateAsync } = trpc.page.update.useMutation()

  // console.log('data======blocks:', data)

  const content = pageToSlate(data)

  const debounced = useDebouncedCallback(
    async (value: PageData) => {
      // ignore first render
      if (value.blocks.length && value.blocks[0].pageId) return

      // return
      try {
        await mutateAsync({
          pageId: data.id,
          title: value.title || '',
          elements: JSON.stringify(value.blocks),
        })
      } catch (error) {
        console.log('error:', error)
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
      <div className="relative min-h-[500px] max-w-4xl py-12 sm:py-12 px-5 sm:px-8 mx-auto z-0">
        <div className="mb-1 flex flex-col space-y-3 ">
          {/* <CoverUpload post={data} /> */}
          <TextareaAutosize
            placeholder="Title"
            defaultValue={data?.title || ''}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                appEmitter.emit('KEY_DOWN_ENTER_ON_TITLE')
              }
            }}
            onChange={(e) => {
              setData({ ...data, title: e.target.value })
            }}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
          />
        </div>

        <PlateEditor
          className="w-full -mx-6"
          showAddButton
          value={content}
          onChange={(v) => {
            console.log('v======:', v)
            setData({ ...data, blocks: v })
          }}
        />
      </div>
    </div>
  )
}
