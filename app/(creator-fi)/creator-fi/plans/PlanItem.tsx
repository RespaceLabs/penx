'use client'

import { useMemberDialog } from '@/app/(creator-fi)/components/MemberDialog/useMemberDialog'
import { Plan } from '@/app/(creator-fi)/domains/Plan'
import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import { useMembers } from '@/app/(creator-fi)/hooks/useMembers'
import { useSubscriptions } from '@/app/(creator-fi)/hooks/useSubscriptions'
import { PlateEditor } from '@/components/editor/plate-editor'
import { useSpaceContext } from '@/components/SpaceContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEthPrice } from '@/hooks/useEthPrice'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { EditIcon } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useUpdatePlanDialog } from './UpdatePlanDialog/useUpdatePlanDialog'

interface Props {
  plan: Plan
}

export function PlanItem({ plan }: Props) {
  const address = useAddress()
  const { ethPrice } = useEthPrice()
  const { setState } = useUpdatePlanDialog()
  const space = useSpaceContext()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { subscriptions } = useSubscriptions()
  const { setState: setMemberState } = useMemberDialog()
  const subscription = subscriptions.find((s) => s.planId === plan.id)!
  const { members } = useMembers()
  const isMember = members?.some(
    (m) => m.account === address && m.planId === plan.id,
  )

  return (
    <Card className="relative flex min-h-[520px] flex-col justify-between gap-4 rounded-xl p-4 shadow-none bg-background w-[300px]">
      {space.isFounder(address) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 rounded-full"
          onClick={() => setState({ isOpen: true, plan: plan })}
        >
          <EditIcon size={20} className="text-foreground/50" />
        </Button>
      )}
      <div className="space-y-1">
        <div className="flex">
          <div>{plan.name}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">
            {plan.getUsdPrice(ethPrice).toFixed(2)} USD
          </div>
          <div>/ month</div>
        </div>
      </div>

      <div className="flex-1">
        <PlateEditor value={plan.benefitsJson} readonly className="p-0" />
      </div>

      <Button
        // variant="outline"
        onClick={() => {
          if (!isConnected) return openConnectModal?.()
          setMemberState({
            isOpen: true,
            plan,
            subscription,
          })
        }}
      >
        <span className="i-[token--eth] h-6 w-6"></span>
        {isMember && <div>Update subscription</div>}
        {!isMember && <div>Become a member</div>}
      </Button>
    </Card>
  )
}
