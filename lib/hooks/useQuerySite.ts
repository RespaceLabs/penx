'use client'

import { trpc } from '../trpc'

export function useQuerySite() {
  const { data, ...rest } = trpc.site.getSite.useQuery()
  return { data, site: data!, ...rest }
}
