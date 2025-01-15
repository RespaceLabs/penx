'use client'

import { useEffect, useMemo, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Calendar } from '@/components/ui/calendar'
import { appEmitter } from '@/lib/app-emitter'
import { PageData, usePage } from '@/lib/hooks/usePage'
import { pageToSlate } from '@/lib/serializer/pageToSlate'
import { trpc } from '@/lib/trpc'
import { isValidUUIDv4 } from '@/lib/utils'
import { PlateEditor } from '../editor/plate-editor'
import { CoverUpload } from './CoverUpload'
import { JournalNav } from './JournalNav'

type PageWithElements = PageData & { elements?: any[] }

export function Page() {
  const { page } = usePage()
  const [data, setData] = useState<PageWithElements>(page!)
  const { mutateAsync } = trpc.page.update.useMutation()
  const [date, setDate] = useState<Date | undefined>(new Date())

  // console.log('data======blocks:', data)

  const content = pageToSlate(data)

  const params = useSearchParams()
  const id = params?.get('id') || ''

  const isJournal = useMemo(() => {
    return !isValidUUIDv4(id)
  }, [id])

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isToday = id === 'today'

  const journalTitle = useMemo(() => {
    if (!isJournal) return ''
    if (isToday) return 'Today, ' + format(new Date(Date.now()), 'LLL do')
    const formattedDate = format(new Date(id || Date.now()), 'LLL do')
    return formattedDate
  }, [isJournal, isToday, id])

  const debounced = useDebouncedCallback(
    async (value: PageWithElements) => {
      // ignore first render
      // if (data.title === value.title) {
      //   return
      // }

      // return
      try {
        await mutateAsync({
          pageId: data.id,
          title: value.title || '',
          elements: JSON.stringify(value.elements || content),
        })
      } catch (error) {
        console.log('error:', error)
      }
    },
    // delay in ms
    400,
  )

  // useEffect(() => {
  //   debounced(data)
  // }, [data, debounced])

  return (
    <div className="w-full h-full">
      <div className="relative min-h-[500px] max-w-4xl py-12 sm:py-12 px-5 sm:px-8 mx-auto z-0">
        <div className="mb-1 flex flex-col space-y-3 ">
          {/* <CoverUpload post={data} /> */}
          {isJournal && (
            <div className="flex items-center gap-4">
              <span className="text-foreground text-4xl font-bold">
                {journalTitle}
              </span>
              <JournalNav date={page.date!} />
            </div>
          )}

          {!isJournal && (
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
                debounced({ ...data, title: e.target.value })
              }}
              className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
            />
          )}
        </div>

        <PlateEditor
          className="w-full -mx-6"
          showAddButton
          value={content}
          onChange={(v) => {
            console.log('=======v:', v)

            setData({ ...data, elements: v })
            debounced({ ...data, elements: v })
          }}
        />
      </div>
    </div>
  )
}
