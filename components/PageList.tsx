'use client'

import { format } from 'date-fns'
import { Edit3Icon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { usePages } from '@/lib/hooks/usePages'
import { cn } from '@/lib/utils'
import { Database, Page } from '@/server/db/schema'
import { DeleteDatabaseDialog } from './database-ui/DeleteDatabaseDialog/DeleteDatabaseDialog'
import { useDeleteDatabaseDialog } from './database-ui/DeleteDatabaseDialog/useDeleteDatabaseDialog'

interface PageItemProps {
  page: Page
}

export function PageItem({ page }: PageItemProps) {
  const { setState } = useDeleteDatabaseDialog()

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          href={`/~/page?id=${page.id}`}
          className="inline-flex items-center hover:scale-105 transition-transform"
        >
          <div className="text-base font-bold">{page.title || 'Untitled'}</div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-zinc-500">
          <div>{format(new Date(page.updatedAt), 'yyyy-MM-dd')}</div>
        </div>
        <Link href={`/~/page?id=${page.id}`}>
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 gap-1 opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>Edit</div>
          </Button>
        </Link>
        <Button
          size="xs"
          variant="ghost"
          className="rounded-full text-xs h-7 text-red-500 gap-1 opacity-60"
          onClick={async () => {
            setState({
              isOpen: true,
              databaseId: page.id,
            })
          }}
        >
          <Trash2 size={14}></Trash2>
          <div>Delete</div>
        </Button>
      </div>
    </div>
  )
}

export function PageList() {
  const { data: pages, isLoading } = usePages()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!pages?.length) {
    return <div className="text-foreground/60">No page yet.</div>
  }

  return (
    <div className="grid gap-4">
      <DeleteDatabaseDialog />
      {pages.map((page) => {
        return <PageItem key={page.id} page={page} />
      })}
    </div>
  )
}
