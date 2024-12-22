'use client'

import { format } from 'date-fns'
import { Edit3Icon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { cn } from '@/lib/utils'
import { Database } from '@/server/db/schema'
import { DeleteDatabaseDialog } from './database-ui/DeleteDatabaseDialog/DeleteDatabaseDialog'
import { useDeleteDatabaseDialog } from './database-ui/DeleteDatabaseDialog/useDeleteDatabaseDialog'

interface PostItemProps {
  database: Database
}

export function PostItem({ database: database }: PostItemProps) {
  const { setState } = useDeleteDatabaseDialog()

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          href={`/~/database?id=${database.id}`}
          className="inline-flex items-center hover:scale-105 transition-transform"
        >
          <div className="text-base font-bold">
            {database.name || 'Untitled'}
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-zinc-500">
          <div>{format(new Date(database.updatedAt), 'yyyy-MM-dd')}</div>
        </div>
        <Link href={`/~/database?id=${database.id}`}>
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
              databaseId: database.id,
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

export function DatabaseList() {
  const { data: databases = [], isLoading } = useDatabases()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!databases.length) {
    return <div className="text-foreground/60">No databases yet.</div>
  }

  return (
    <div className="grid gap-4">
      <DeleteDatabaseDialog />
      {databases.map((post) => {
        return <PostItem key={post.id} database={post} />
      })}
    </div>
  )
}
