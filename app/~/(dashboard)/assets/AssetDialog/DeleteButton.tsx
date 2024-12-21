'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAssets } from '@/lib/hooks/useAssets'
import { useTrashedAssets } from '@/lib/hooks/useTrashedAssets'
import { trpc } from '@/lib/trpc'
import { useAssetDialog } from './useAssetDialog'

interface Props {}

export function DeleteButton({}: Props) {
  const { setIsOpen, asset } = useAssetDialog()
  const assets = useAssets()
  const trashedAssets = useTrashedAssets()
  const trashAsset = trpc.asset.trash.useMutation()
  const deleteAsset = trpc.asset.delete.useMutation()

  return (
    <Button
      variant="secondary"
      disabled={trashAsset.isPending || deleteAsset.isPending}
      className="flex item-center gap-1"
      onClick={async () => {
        if (asset.isTrashed) {
          await deleteAsset.mutateAsync({
            assetId: asset.id,
            key: asset.url!,
          })
          toast.success('Image deleted successfully!')
        } else {
          await trashAsset.mutateAsync({ assetId: asset.id })
          toast.success('Image trashed successfully!')
        }
        assets.refetch()
        trashedAssets.refetch()
        setIsOpen(false)
      }}
    >
      <Trash2 size={16} className="" />
      <div>{asset.isTrashed ? 'Delete permanently' : 'Trash'}</div>
    </Button>
  )
}
