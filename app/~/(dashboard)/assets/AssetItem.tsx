'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { placeholderBlurhash } from '@/lib/constants'
import { Asset } from '@/lib/hooks/useAssets'
import { useLoadAsset } from '@/lib/hooks/useLoadAsset'
import Image from 'next/image'
import { useAssetDialog } from './AssetDialog/useAssetDialog'

interface AssetItemProps {
  asset: Asset
}

export function AssetItem({ asset }: AssetItemProps) {
  const { setState } = useAssetDialog()
  const { url, isLoading } = useLoadAsset(asset)

  if (isLoading) {
    return (
      <Image
        alt=""
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 mb-5"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        src={placeholderBlurhash}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />
    )
  }

  return (
    <div
      key={asset.id}
      className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
      onClick={() => {
        setState({
          isOpen: true,
          asset: asset,
        })
      }}
    >
      <img
        alt={asset.filename || ''}
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        // placeholder="blur"
        // blurDataURL={placeholderBlurhash}
        src={url}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />
    </div>
  )
}
