'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'
import { useAppLoading } from '@/hooks/useAppLoading'
import { AppService } from '@/services/AppService'
import { useParams, useRouter } from 'next/navigation'
import LoadingDots from '../icons/loading-dots'

export function AppProvider({ children }: PropsWithChildren) {
  const { loading } = useAppLoading()
  const initedRef = useRef(false)
  const appRef = useRef(new AppService())
  const { push } = useRouter()
  const params = useParams() as Record<string, string>

  useEffect(() => {
    if (initedRef.current) return
    initedRef.current = true
    appRef.current.init(params?.id).then((path) => {
      if (path) {
        push(path)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots />
      </div>
    )
  }

  return <>{children}</>
}
