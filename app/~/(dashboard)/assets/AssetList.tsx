'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { placeholderBlurhash } from '@/lib/constants'
import { Asset, useAssets } from '@/lib/hooks/useAssets'
import { useTrashedAssets } from '@/lib/hooks/useTrashedAssets'
import Image from 'next/image'
import { useAssetDialog } from './AssetDialog/useAssetDialog'
import { AssetItem } from './AssetItem'

interface AssetListProps {
  isTrashed: boolean
}

export function AssetList({ isTrashed }: AssetListProps) {
  return isTrashed ? <TrashedList /> : <NormalList />
}

function NormalList() {
  const { data = [], isLoading } = useAssets()
  return <AssetListContent isLoading={isLoading} assets={data} />
}

function TrashedList() {
  const { data = [], isLoading } = useTrashedAssets()
  return <AssetListContent isLoading={isLoading} assets={data} />
}

interface AssetListContentProps {
  isLoading: boolean
  assets: Asset[]
}

function AssetListContent({ isLoading, assets }: AssetListContentProps) {
  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <LoadingDots />
      </div>
    )
  }

  if (!assets.length) {
    return <p className="px-4 text-sm text-foreground/60">No assets found</p>
  }

  return (
    <div>
      <div className="columns-2 gap-4 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
        {assets.map((item) => (
          <AssetItem key={item.id} asset={item} />
        ))}
      </div>
    </div>
  )
}
