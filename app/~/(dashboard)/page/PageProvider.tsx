'use client'

import { PropsWithChildren, useEffect } from 'react'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { LoadingDots } from '@/components/icons/loading-dots'
import {
  loadPage,
  pageAtom,
  usePage,
  usePageLoading,
} from '@/lib/hooks/usePage'
import { store } from '@/lib/store'
import { isValidUUIDv4 } from '@/lib/utils'

export function PageProvider({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const id = params?.get('id')
  const { page } = usePage()
  const { isPageLoading } = usePageLoading()

  useEffect(() => {
    if (!id) return

    // if (id && store.get(pageAtom)?.id !== id) {
    // }

    if (!isValidUUIDv4(id)) {
      const date = id === 'today' ? format(new Date(), 'yyyy-MM-dd') : id
      loadPage({ date: date })
    } else {
      loadPage({ pageId: id })
    }
  }, [id])

  if (isPageLoading || !page) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <>{children}</>
}
