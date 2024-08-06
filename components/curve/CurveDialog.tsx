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
import { RouterOutputs } from '@/server/_app'
import { Curve } from './Curve'
import { CurveButton } from './CurveButton'

interface Props {
  space: RouterOutputs['space']['byId']
}

export function CurveDialog({ space }: Props) {
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
          <Curve className="-mx-4" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
