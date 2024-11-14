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
    <div className="w-full">
      {space.isFounder(address) && <AddPlanDialog />}

      <UpdatePlanDialog />
      <MemberDialog />
      <div className="mt-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3">
        {plans.map((item, index) => {
          return <PlanItem key={index} plan={item} />
        })}
      </div>
    </div>
  )
}
