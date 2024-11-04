import { databaseDomain } from './domains/database.domain'
import { nodeDomain } from './domains/node.domain'
import { plantreeDB } from './plantree-db'

export const db = {
  ...plantreeDB,
  ...nodeDomain,
  ...databaseDomain,
  plantreeDB,
}
