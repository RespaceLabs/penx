'use client'

import Image from 'next/image'
import { LoadingDots } from '@/components/icons/loading-dots'
import { placeholderBlurhash } from '@/lib/constants'
import { Asset, useAssets } from '@/lib/hooks/useAssets'
import { useTrashedAssets } from '@/lib/hooks/useTrashedAssets'
import { useAssetDialog } from './AssetDialog/useAssetDialog'

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
  const { setState } = useAssetDialog()

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
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
        {assets.map((item) => (
          <div
            key={item.id}
            className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            onClick={() => {
              setState({
                isOpen: true,
                asset: item,
              })
            }}
          >
            <Image
              alt={item.filename || ''}
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              style={{ transform: 'translate3d(0, 0, 0)' }}
              placeholder="blur"
              blurDataURL={placeholderBlurhash}
              src={`/asset/${item.url}?s=400`}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
