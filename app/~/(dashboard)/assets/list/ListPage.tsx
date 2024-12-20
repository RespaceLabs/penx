'use client'

import { useAssets } from '@/lib/hooks/useAssets'
import { AssetsTable } from '../AssetsTable'

export function ListPage() {
  const { isLoading, data = [] } = useAssets()
  if (isLoading) return null
  return <AssetsTable assets={data} />
}
