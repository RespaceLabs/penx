import { OptionTag } from '@/components/OptionTag'
import { mappedByKey } from '@/lib/shared'
import { FieldType, Option } from '@/lib/types'
import { Record as Row } from '@/server/db/schema'
import { useDatabaseContext } from '../DatabaseProvider'
import { FieldIcon } from '../shared/FieldIcon'

interface Tag {
  text: string
}

interface GalleryViewProps {}

export const GalleryView = ({}: GalleryViewProps) => {
  const { database } = useDatabaseContext()
  const { records } = database

  return (
    <div className="grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pt-4 py-20 grid">
      {records.map((record, index) => (
        <GalleryItem key={record.id} record={record} index={index} />
      ))}
    </div>
  )
}

interface GalleryItemProps {
  record: Row
  index: number
}

function GalleryItem({ record }: GalleryItemProps) {
  const { database } = useDatabaseContext()
  const fieldMaps = mappedByKey(database.fields, 'id')

  return (
    <div className="relative mb-5 w-full border border-foreground/10 rounded-md p-4 flex flex-col gap-1">
      {Object.entries<any>(record.fields as Record<string, any>).map(
        ([key, value]) => {
          const field = fieldMaps[key]

          const valueJsx = () => {
            if (field.fieldType === FieldType.TEXT) {
              return value
            }

            if (
              field.fieldType === FieldType.SINGLE_SELECT ||
              field.fieldType === FieldType.MULTIPLE_SELECT
            ) {
              const ids: string[] = value
              const options = field.options as Option[]
              return (
                <div className="flex items-center gap-1">
                  {options
                    .filter((o) => ids.includes(o.id))
                    .map((o) => (
                      <OptionTag key={o.id} option={o} />
                    ))}
                </div>
              )
            }
            return value?.toString()
          }

          return (
            <div key={key} className="flex justify-between">
              <div className="flex items-center gap-1 text-sm font-medium">
                <FieldIcon fieldType={field.fieldType as any} />
                <div>{field.displayName}</div>
              </div>
              <div>{valueJsx()}</div>
            </div>
          )
        },
      )}
    </div>
  )
}
