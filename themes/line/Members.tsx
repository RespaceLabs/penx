import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import { Subscription } from '@/domains/Subscription'
import { shortenAddress } from '@/lib/utils'
import { MembersProps } from '@/theme-helper/types'

export function Members({ space, members }: MembersProps) {
  return (
    <div className="grid gap-2 -ml-5">
      {members.map((member) => {
        const subscription = new Subscription({
          amount: BigInt(member.amount),
          checkpoint: BigInt(member.checkpoint),
          duration: BigInt(member.duration),
          consumed: BigInt(member.consumed),
          start: BigInt(member.start),
        })

        return (
          <div key={member.id} className="flex justify-between">
            <div className="flex gap-2 items-center">
              <UserAvatar user={member.user as any} />
              {member.user.ensName ? (
                <>
                  {member.user.ensName}
                  <Badge variant="secondary">
                    {shortenAddress(member.user.address)}
                  </Badge>
                </>
              ) : (
                <div>{shortenAddress(member.user.address)}</div>
              )}
            </div>

            <div>
              <span className="font-bold">{subscription.daysFormatted}</span>{' '}
              days
            </div>
          </div>
        )
      })}
    </div>
  )
}
