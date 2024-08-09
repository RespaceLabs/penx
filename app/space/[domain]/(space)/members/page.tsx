import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import {
  getPostsForSpace,
  getSpaceData,
  getSpaceWithMembers,
} from '@/lib/fetchers'
import { precision } from '@/lib/math'
import prisma from '@/lib/prisma'
import { shortenAddress } from '@/lib/utils'
import { notFound } from 'next/navigation'

// export const dynamic = 'force-static'
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const allSpaces = await prisma.space.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
    // feel free to remove this filter if you want to generate paths for all spaces
    where: {
      subdomain: 'demo',
    },
  })

  const allPaths = allSpaces
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean)

  return allPaths
}

export default async function SpaceHomePage({
  params,
}: {
  params: { domain: string }
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const space = await getSpaceWithMembers(domain)

  if (!space) {
    notFound()
  }

  const { members } = space

  return (
    <div className="grid gap-2">
      {members.map((member) => (
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
            has <span className="font-bold">{member.amount}</span> Keys
          </div>
        </div>
      ))}
    </div>
  )
}
