'use client'

import { MemberDialog } from '@/app/(creator-fi)/components/MemberDialog/MemberDialog'
import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import { usePlans } from '@/app/(creator-fi)/hooks/usePlans'
import { useSpaceContext } from '@/components/SpaceContext'
import { AddPlanDialog } from './AddPlanDialog/AddPlanDialog'
import { PlanItem } from './PlanItem'
import { UpdatePlanDialog } from './UpdatePlanDialog/UpdatePlanDialog'

interface Props {}

export function PlanList({}: Props) {
  const { plans, isLoading } = usePlans()
  const space = useSpaceContext()
  const address = useAddress()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!plans.length) {
    return <div className="text-foreground/60">No plans yet!</div>
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {space.isFounder(address) && (
        <div className="flex justify-center">
          <AddPlanDialog />
        </div>
      )}

      <UpdatePlanDialog />
      <MemberDialog />
      <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
        {plans.map((item, index) => {
          return <PlanItem key={index} plan={item} />
        })}
      </div>
    </div>
  )
}
