import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/UserAvatar'
import { getSpaceWithSponsors } from '@/lib/fetchers'
import { precision } from '@/lib/math'
import prisma from '@/lib/prisma'
import { shortenAddress } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { BuyButton } from './BuyButton'
import { SellButton } from './SellButton'
import { SponsorBuyDialog } from './SponsorBuyDialog/SponsorBuyDialog'
import { SponsorSellDialog } from './SponsorSellDialog/SponsorSellDialog'

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
  const space = await getSpaceWithSponsors(domain)

  if (!space) {
    notFound()
  }

  const { sponsors } = space

  return (
    <div>
      {space.sponsorCreationId && (
        <>
          <SponsorBuyDialog space={space} />
          <SponsorSellDialog space={space} />
        </>
      )}

      <div className="flex gap-2 mb-10">
        <BuyButton />
        <SellButton></SellButton>
      </div>

      <div className="grid gap-3">
        {sponsors.map((item) => (
          <div key={item.id} className="flex justify-between">
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
            <div>
              <span className="font-bold">{item.amount}</span> Keys
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
