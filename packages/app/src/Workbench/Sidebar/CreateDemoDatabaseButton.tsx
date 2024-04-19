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
        const databaseId = 'b7ab57c0-2778-411f-9f21-cc931762a4b5'

        const list = Array(100000)
          .fill(0)
          .map((_, i) => i)

        const t0 = Date.now()
        for (const i of list) {
          const ta = Date.now()

          // console.log('============:', i)
          await db.addRowByFieldName({
            databaseId,
            name: 'Notion',
            url: 'https://www.notion.so',
            tag: 'react',
          })
          const tb = Date.now()
          console.log('i-------:', i, tb - ta)
        }
        const t1 = Date.now()
        console.log('===========:time: ', t1 - t0, 'ms')

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
