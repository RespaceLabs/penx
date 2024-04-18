import { Button } from 'uikit'
import { useActiveSpace } from '@penx/hooks'
import { db } from '@penx/local-db'
import { FieldType } from '@penx/model-types'

export function CreateDemoDatabaseButton() {
  const { activeSpace } = useActiveSpace()

  return (
    <Button
      size="lg"
      roundedFull
      colorScheme="white"
      w-100p
      onClick={async () => {
        db.addRowByFieldName({
          databaseId: 'b7ab57c0-2778-411f-9f21-cc931762a4b5',
          name: 'Notion',
          url: 'https://www.notion.so',
        })
        return
        await db.createDatabase({
          spaceId: activeSpace.id,
          name: 'bookmark-demo',
          columnSchema: [
            {
              isPrimary: true,
              displayName: 'name',
              fieldName: 'name',
              fieldType: FieldType.TEXT,
            },
            {
              displayName: 'URL',
              fieldName: 'url',
              fieldType: FieldType.URL,
            },
          ],
          shouldInitCells: false,
        })
      }}
    >
      Create Demo Database
    </Button>
  )
}
