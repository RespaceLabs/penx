import * as schema from '@/server/db/schema'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'

export const runtime = 'edge'

function initDbConnection() {
  if (process.env.NODE_ENV === 'development') {
    const { env } = getRequestContext()

    return drizzle(env.DB, { schema })
  }

  return drizzle(process.env.DB as unknown as D1Database, { schema })
}

export const db = initDbConnection()
