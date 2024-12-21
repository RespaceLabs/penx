'use client'

import { ExternalLink, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { isProd, placeholderBlurhash } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { DeleteButton } from './DeleteButton'
import { useAssetDialog } from './useAssetDialog'

interface Props {}

export function AssetDialog({}: Props) {
  const { isOpen, setIsOpen, asset: asset } = useAssetDialog()
  const { refetch } = trpc.asset.list.useQuery({
    pageSize: 10000,
  })

  const { mutateAsync: trash, isPending } = trpc.asset.trash.useMutation()
  const { mutateAsync: updatePublicStatus } =
    trpc.asset.updatePublicStatus.useMutation()

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
            <div className="flex items-center gap-1">
              <div className="text-sm">Public visit</div>
              <Switch
                defaultChecked={!!asset.isPublic}
                onCheckedChange={async (value) => {
                  try {
                    await updatePublicStatus({
                      assetId: asset.id,
                      isPublic: value,
                    })
                    refetch()
                    toast.success('Image public status updated successfully!')
                  } catch (error) {
                    toast.error(
                      extractErrorMessage(error) ||
                        'Failed to update public status!',
                    )
                  }
                }}
              />
            </div>
            <a href={url} target="_blank">
              <Button size="icon" variant="secondary" className="">
                <ExternalLink size={20} className="" />
              </Button>
            </a>
            <DeleteButton />
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
