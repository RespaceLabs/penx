import { ReactNode } from 'react'
import { getSpaceData } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { fontMapper } from '@/styles/fonts'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CurveChart } from '../../../../components/curve/CurveChart'
import { SpaceFooter } from '../../../../components/SpaceFooter'
import { ActiveLinkBorder } from './ActiveLinkBorder'
import { SpaceNav } from './SpaceHome/SpaceNav'
import { SpaceSidebar } from './SpaceHome/SpaceSidebar'

export async function generateMetadata(
  { params }: { params: { domain: string } },
  state: any,
): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const data = await getSpaceData(domain)
  if (!data) {
    return null
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string
    description: string
    image: string
    logo: string
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@vercel',
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
    //     },
    //   }),
  }
}

export default async function SpaceLayout({
  params,
  children,
  ...rest
}: {
  params: { domain: string }
  children: ReactNode
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const data = await getSpaceData(domain)
  const headerList = headers()
  const url = headerList.get('x-current-url') || ''
  const pathname = url.split('?')[0] || ''

  if (!data) {
    notFound()
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === 'true'
  ) {
    return redirect(`https://${data.customDomain}`)
  }

  const Paths = {
    posts: `/@${domain}`,
    members: `/@${domain}/members`,
    sponsors: `/@${domain}/sponsors`,
  }

  const linkClassName = cn(
    'flex flex-col item-center justify-center border-b-2border-transparent text-center gap-2',
  )

  const fragment = pathname.split('/').pop() || ''

  return (
    <div className={fontMapper[data.font]}>
      <SpaceNav space={data} />
      <div className="flex justify-center min-h-[100vh] md:w-[1200px] sm:w-full mx-auto gap-10 pb-20">
        <div className="flex-1 min-h-[100vh] mt-10 pr-8">
          <div className="text-4xl font-semibold mb-10">{data.name}</div>
          <div className="border-b flex items-center gap-6">
            <Link href={Paths.posts} className={linkClassName}>
              <div className="">Posts</div>
              <ActiveLinkBorder pathname={Paths.posts} />
            </Link>
            <Link href={Paths.members} className={linkClassName}>
              <div className="">Members</div>
              <ActiveLinkBorder pathname={Paths.members} />
            </Link>
            {data.sponsorCreationId && (
              <Link href={Paths.sponsors} className={linkClassName}>
                <div className="">Sponsors</div>
                <ActiveLinkBorder pathname={Paths.sponsors} />
              </Link>
            )}
          </div>

          <div className="pt-10">{children}</div>
        </div>
        <SpaceSidebar space={data} />
      </div>
    </div>
  )
}
