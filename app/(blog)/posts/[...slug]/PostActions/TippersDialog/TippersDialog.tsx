'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserAvatar } from '@/components/UserAvatar'
import { useCollectRecords } from '@/hooks/useCollectRecords'
import { useTipRecords } from '@/hooks/useTipRecords'
import { precision } from '@/lib/math'
import { shortenAddress } from '@/lib/utils'
import { Post } from '@penxio/types'
import { useTippersDialog } from './useCollectorsDialog'

interface Props {
  post: Post
}

export function TippersDialog({ post }: Props) {
  const { isOpen, setIsOpen } = useTippersDialog()
  const { records = [] } = useTipRecords(post.id)

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[400px] min-h-96 flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="">Tip records</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          {records.map((record) => (
            <div key={record.id} className="flex items-center justify-between">
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
  )
}
