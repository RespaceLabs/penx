'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { isServer } from '@/lib/constants'
import { runWorker } from '@/lib/worker'
import { Site } from '@prisma/client'

let inited = false

if (!isServer) {
  // setTimeout(() => {
  //   if (inited) return
  //   inited = true
  //   runWorker()
  // }, 2000)
}

export const SiteContext = createContext({} as Site)

interface Props {
  site: Site
}

export const SiteProvider = ({ site, children }: PropsWithChildren<Props>) => {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSiteContext() {
  return useContext(SiteContext)
}
