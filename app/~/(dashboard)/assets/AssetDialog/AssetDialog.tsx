'use client'

import { ExternalLink, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { isProd, placeholderBlurhash } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { useAssetDialog } from './useAssetDialog'

interface Props {}

export function AssetDialog({}: Props) {
  const { isOpen, setIsOpen, asset: asset } = useAssetDialog()
  const { refetch } = trpc.asset.list.useQuery({
    pageSize: 10000,
  })

  const { mutateAsync, isPending } = trpc.asset.trash.useMutation()

  if (!asset) return null

  const url = `${location.protocol}//${location.host}/asset/${asset.url}`
  const name = asset.title || asset.filename
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        closable={false}
        className="h-screen max-w-[100wv] border-none bg-background shadow-none rounded-none w-screen flex flex-col p-0"
      >
        <DialogHeader className="flex flex-row items-center justify-between w-full gap-3 px-3">
          <div className="flex flex-row items-center gap-3 mr-auto">
            <DialogTitle className="">{name}</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank">
              <Button size="icon" variant="secondary" className="">
                <ExternalLink size={20} className="" />
              </Button>
            </a>
            <Button
              size="icon"
              variant="secondary"
              disabled={isPending}
              className=""
              onClick={async () => {
                await mutateAsync({ assetId: asset.id })
                refetch()
                setIsOpen(false)
              }}
            >
              <Trash2 size={20} className="" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className=""
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <X size={20} className="" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-center flex-1">
          <img
            alt={asset.filename || ''}
            className="h-auto w-auto max-h-[80vh] max-w-[80vw] object-contain transition-transform"
            style={{ transform: 'translate3d(0, 0, 0)' }}
            // placeholder="blur"
            // blurDataURL={placeholderBlurhash}
            src={`/asset/${asset.url}?s=1360`}
            width={720}
            height={480}
            // sizes="(max-width: 640px) 100vw,
            //       (max-width: 1280px) 50vw,
            //       (max-width: 1536px) 33vw,
            //       25vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
