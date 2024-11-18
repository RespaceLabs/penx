'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { ELECTRIC_BASE_URL, isServer } from '@/lib/constants'
import { runWorker } from '@/lib/worker'
import { PGlite } from '@electric-sql/pglite'
import { electricSync } from '@electric-sql/pglite-sync'
import { live } from '@electric-sql/pglite/live'
import { Site } from '@penxio/types'

async function runPG() {
  console.log('init.........')

  const db = await PGlite.create({
    dataDir: 'idb://penx',
    extensions: {
      electric: electricSync({ debug: true }),
      live,
    },
  })

  return
  await db.electric.syncShapeToTable({
    shape: {
      url: `${ELECTRIC_BASE_URL}/v1/shape/node`,
    },

    table: 'node',
    primaryKey: ['id'],
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS node (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      userId UUID,
      parentId UUID,
      databaseId UUID,
      type TEXT NOT NULL,
      element JSONB NOT NULL,
      props JSONB,
      collapsed BOOLEAN DEFAULT FALSE,
      folded BOOLEAN DEFAULT TRUE,
      children JSONB,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_userId ON node(userId);
    CREATE INDEX IF NOT EXISTS idx_type ON node(type);
  `)

  // await db.exec(`
  //   INSERT INTO node (id, userId, parentId, databaseId, type, element, props, collapsed, folded, children, createdAt, updatedAt)
  //   VALUES (
  //       gen_random_uuid(),
  //       '550e8400-e29b-41d4-a716-446655440000',
  //       NULL,
  //       '550e8400-e29b-41d4-a716-446655440001',
  //       'exampleType',
  //       '{"key": "value"}',
  //       '{"propKey": "propValue"}',
  //       FALSE,
  //       TRUE,
  //       NULL,
  //       CURRENT_TIMESTAMP,
  //       CURRENT_TIMESTAMP
  //   );
  // `)

  const ret = await db.query(`
  SELECT * from node;
`)
  console.log('=====ret:', ret)
}

let inited = false
if (!isServer) {
  setTimeout(() => {
    if (inited) return
    inited = true
    runWorker()
  }, 2000)

  // runPG()
}

export const SiteContext = createContext({} as Site)

interface Props {
  site: Site
}

export const SiteProvider = ({ site, children }: PropsWithChildren<Props>) => {
  useEffect(() => {
    window.__SITE__ = site
  }, [site])

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSiteContext() {
  return useContext(SiteContext)
}
