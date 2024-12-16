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
import { useTipRecords } from '@/hooks/useTipRecords'
import { precision } from '@/lib/math'
import { shortenAddress } from '@/lib/utils'
import { Post } from '@penxio/types'
import { TippedAmount } from '../TippedAmount'

interface Props {
  post: Post
  receivers: string[]
}

export function TippersDialog({ post, receivers }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { records = [] } = useTipRecords(post.id, isOpen)

  return (
    <>
      <TippedAmount post={post} receivers={receivers} setIsOpen={setIsOpen} />
      <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <DialogContent className="sm:max-w-[400px] min-h-96 flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="">Tip records</DialogTitle>
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
                  <UserAvatar address={record.tipper} />
                  <div>{shortenAddress(record.tipper)}</div>
                </div>
                <div className="font-bold">
                  {precision.toDecimal(record.amount) *
                    (1 -
                      Number(record.tipperRewardPercent) /
                        Number(precision.token(1)))}{' '}
                  $PEN
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
