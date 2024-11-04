import { databaseDomain } from './domains/database.domain'
import { initDomain } from './domains/init.domain'
import { nodeDomain } from './domains/node.domain'
import { plantreeDB } from './plantree-db'

export const db = {
  ...plantreeDB,
  ...initDomain,
  ...nodeDomain,
  ...databaseDomain,
  plantreeDB,
}
