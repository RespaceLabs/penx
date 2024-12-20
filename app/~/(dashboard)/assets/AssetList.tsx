'use client'

import Image from 'next/image'
import { isProd, placeholderBlurhash } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { useAssetDialog } from './AssetDialog/useAssetDialog'

export function AssetList() {
  const { setState } = useAssetDialog()
  const { data = [] } = trpc.asset.list.useQuery({
    pageSize: 10000,
  })

  return (
    <div>
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
        {data.map((item) => (
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
