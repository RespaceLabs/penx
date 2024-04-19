import { databaseDomain } from './domains/database.domain'
import { nodeDomain } from './domains/node.domain'
import { spaceDomain } from './domains/space.domain'
import { penxDB } from './penx-db'

export const db = {
  ...penxDB,
  ...databaseDomain,
  ...nodeDomain,
  ...spaceDomain,
  penx: penxDB,
}
