'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { useAppLoading } from '@/hooks/useAppLoading'
import { AppService } from '@/services/AppService'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'

export function AppProvider({ children }: PropsWithChildren) {
  const { loading } = useAppLoading()
  const initedRef = useRef(false)
  const appRef = useRef(new AppService())
  const params = useParams() as Record<string, string>

  useEffect(() => {
    if (initedRef.current) return
    initedRef.current = true

    appRef.current.init({
      postId: params?.postId,
    })
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
