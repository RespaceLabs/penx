'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserAvatar } from '@/components/UserAvatar'
import { useSpaces } from '@/hooks/useSpaces'
import { precision } from '@/lib/math'
import { trpc } from '@/lib/trpc'
import { cn, shortenAddress } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function SponsorList() {
  const { space } = useSpaces()
  const { data = [], isLoading } = trpc.sponsor.listBySpaceId.useQuery(
    space?.id,
    { enabled: !!space?.id },
  )

  if (isLoading) {
    return (
      <div className="grid gap-4 mx-auto w-[800x] md:w-[800px] sm:w-full mt-6">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="grid gap-4 mx-auto w-[800x] md:w-[800px] sm:w-full mt-6 text-center text-neutral-400">
        No sponsors yet.
      </div>
    )
  }

  const textMap: Record<string, string> = {
    PENDING: 'Pending',
    AGREED: 'Agreed',
    REJECTED: 'Rejected',
  }

  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex gap-2 items-center">
                <UserAvatar user={item.user as any} />

                {item.user.ensName ? (
                  <>
                    {item.user.ensName}
                    <Badge variant="secondary">
                      {shortenAddress(item.user.address)}
                    </Badge>
                  </>
                ) : (
                  <div>{shortenAddress(item.user.address)}</div>
                )}
              </div>
            </TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell className="font-medium text-right">
              <Badge
                className={cn(
                  item.status === 'PENDING' && 'bg-yellow-500',
                  item.status === 'AGREED' && 'bg-green-500',
                  item.status === 'REJECTED' && 'bg-red-500',
                )}
              >
                {textMap[item.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
