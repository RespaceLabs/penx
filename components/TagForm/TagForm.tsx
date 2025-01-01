import { forwardRef } from 'react'
import { Database, useQueryDatabase } from '@/lib/hooks/useQueryDatabase'
import { Box } from '@fower/react'
import Link from 'next/link'
import { Editor, Path } from 'slate'
import { FieldIcon } from '../database-ui/shared/FieldIcon'
import { TTagElement } from '../editor/plugins/tag-plugin/lib/types'
import { LoadingDots } from '../icons/loading-dots'
import { Button } from '../ui/button'

// import { FieldIcon } from '../shared/FieldIcon'
// import { CellField } from './fields'

interface Props {
  element: TTagElement
}

export const TagForm = forwardRef<HTMLDivElement, Props>(function TagForm(
  { element },
  ref,
) {
  const { isLoading, data } = useQueryDatabase(element.databaseId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div ref={ref}>
      <div className="h-12 px-3 flex items-center justify-between border-b">
        <div className="font-bold">Update tag metadata</div>
        <Button size="xs" variant="secondary" className="text-xs" asChild>
          <Link href={`/~/database?id=${element.databaseId}`}>
            Visit database
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 max-h-[400px] overflow-auto p-3">
        <div>Coming soon...</div>
        {/* {data?.fields.map((field) => (
          <div key={field.id}>
            <div className="mb-2 flex items-center gap-1 text-foreground/60">
              <FieldIcon fieldType={field.fieldType} />
              <Box textXS>{field.displayName}</Box>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  )
})
