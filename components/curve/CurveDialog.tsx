'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreation, useQueryCreation } from '@/hooks/useCreation'
import { RouterOutputs } from '@/server/_app'
import { CurveButton } from './CurveButton'
import { CurveChart } from './CurveChart'

interface Props {
  space: RouterOutputs['space']['byId']
}

export function CurveDialog({ space }: Props) {
  useQueryCreation(space.creationId!)
  const { creation } = useCreation()

  if (!creation) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-flex">
          <CurveButton />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[640px]">
        <DialogHeader>
          <DialogTitle>Bonding curve</DialogTitle>
          <div className="text-neutral-600">
            Bonding curve for key price and supply.
          </div>
        </DialogHeader>
        <div className="">
          {creation?.creator && (
            <CurveChart className="-mx-4" curve={creation.curveNumberFormat} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
