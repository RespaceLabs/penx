'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserAvatar } from '@/components/UserAvatar'
import { useCollectRecords } from '@/hooks/useCollectRecords'
import { shortenAddress } from '@/lib/utils'
import { Post } from '@penxio/types'
import { Bookmark } from 'lucide-react'
import { MintedAmount } from './MintedAmount'

interface Props {
  post: Post
}

export function CollectorsDialog({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { records = [] } = useCollectRecords(
    post.creationId?.toString(),
    isOpen,
  )

  if (typeof post.creationId !== 'number') return null
  return (
    <>
      <MintedAmount post={post} setIsOpen={setIsOpen} />
      <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <DialogContent className="sm:max-w-[400px] min-h-96 flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="">Collectors</DialogTitle>
          </DialogHeader>

          <div className="grid gap-2">
            {!records.length && (
              <div className="text-foreground/50">Not tipper found</div>
            )}
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <UserAvatar address={record.minter} />
                  <div>{shortenAddress(record.minter)}</div>
                </div>
                <div className="font-bold">{record.amount}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
