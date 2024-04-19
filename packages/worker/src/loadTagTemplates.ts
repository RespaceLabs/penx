import { db } from '@penx/local-db'
import { ColumnSchema } from '@penx/local-db/src/types'
import { api } from '@penx/trpc-client'

export async function loadTagTemplates() {
  try {
    const localSpaces = await db.listLocalSpaces()
    if (!localSpaces.length) return

    const templates = await api.tagTemplate.tagTemplates.query()
    const localSpace = localSpaces[0]

    for (const template of templates) {
      const dbName = `$template__${template.metadata.name}`
      let database = await db.getDatabaseByName(localSpace.id, dbName)

      if (!database) {
        database = await db.createDatabase({
          spaceId: localSpace.id,
          name: dbName,
          columnSchema: template.columns.map((column, index) => {
            if (index === 0) {
              return {
                ...column,
                isPrimary: true,
              } as ColumnSchema
            }
            return column as ColumnSchema
          }),

          shouldInitCells: false,
        })

        for (const row of template.rows) {
          await db.addRowByFieldName({
            databaseId: database.id,
            ...row,
          })
        }
      }

      // console.log('======database:', database)
    }
  } catch (error) {
    console.log('============error:', error)
  }
}
