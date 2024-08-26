'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSpace } from '@/hooks/useSpace'
import { useThemes } from '@/hooks/useThemes'
import { useSession } from 'next-auth/react'
import { usePublishThemeDialog } from './PublishThemeDialog/usePublishThemeDialog'

export function ThemeList() {
  const { space } = useSpace()
  const { themes = [], isLoading } = useThemes()
  const { setState } = usePublishThemeDialog()

  if (isLoading) {
    return (
      <div className="grid gap-4 mt-6">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
      </div>
    )
  }

  if (!themes.length) {
    return (
      <div className="grid gap-4 mx-auto sm:w-full mt-6 text-neutral-400">
        No themes yet.
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-8">
      {themes.map((item) => (
        <div key={item.id} className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div>{item.name}</div>
            {item.published && <Badge>Published</Badge>}
          </div>
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setState({ isOpen: true, theme: item })
              }}
            >
              Publish
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
