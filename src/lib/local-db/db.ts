import { databaseDomain } from './domains/database.domain'
import { initDomain } from './domains/init.domain'
import { nodeDomain } from './domains/node.domain'
import { penxDB } from './penx-db'

export const db = {
  ...penxDB,
  ...initDomain,
  ...nodeDomain,
  ...databaseDomain,
  penxDB,
}
