import { PropsWithChildren, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { db } from '@penx/local-db'

export function FirstLocalSpaceGenerator({ children }: PropsWithChildren) {
  const initedRef = useRef(false)
  const { isLoading, data, refetch } = useQuery(['localSpaces'], () =>
    db.listLocalSpaces(),
  )

  useEffect(() => {
    if (data?.length || initedRef.current) return
    initedRef.current = true
    db.createLocalSpace().then(() => {
      refetch()
    })
  }, [data, refetch])

  if (isLoading) return null

  if (!data?.length) return null

  return <>{children}</>
}
