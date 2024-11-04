import TextareaAutosize from 'react-textarea-autosize'
import { useDatabaseContext } from '@/lib/database-context'
import { db } from '@/lib/local-db'
import { DatabaseIcon } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

export const DatabaseHeader = () => {
  const { database } = useDatabaseContext()

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    await db.updateNode(database.id, {
      props: { name: value },
    })
  }, 500)

  return (
    <div className="flex items-center pb-1">
      <div className="inline-flex text-foreground/60">
        <DatabaseIcon size={16} />
      </div>
      <TextareaAutosize
        placeholder="Database name"
        rows={1}
        defaultValue={database.props.name || ''}
        onChange={(e) => {
          debouncedUpdate(e.target.value)
        }}
        className="text-sm flex-1 w-full outline-none resize-none"
      />
    </div>
  )
}
