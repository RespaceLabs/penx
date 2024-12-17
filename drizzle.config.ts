import { env } from '@/server/env'
import { defineConfig } from 'drizzle-kit'

/*
 * NOTE: Workaround to make drizzle studio work with D1.
 * https://kevinkipp.com/blog/going-full-stack-on-astro-with-cloudflare-d1-and-drizzle/
 * Github discussion: https://github.com/drizzle-team/drizzle-orm/discussions/1545#discussioncomment-8115423
 */
export default env.DB_LOCAL_PATH
  ? defineConfig({
      schema: './server/db/schema.ts',
      dialect: 'sqlite',
      dbCredentials: {
        url: env.DB_LOCAL_PATH as string,
      },
    })
  : defineConfig({
      schema: './server/db/schema.ts',
      out: './migrations',
      driver: 'd1-http',
      dialect: 'sqlite',
      dbCredentials: {
        accountId: env.CF_ACCOUNT_ID as string,
        token: env.CF_USER_API_TOKEN as string,
        databaseId:
          env.NODE_ENV === 'preview'
            ? (env.DB_PREVIEW_DATABASE_ID as string)
            : (env.DB_PROD_DATABASE_ID! as string),
      },
    })
