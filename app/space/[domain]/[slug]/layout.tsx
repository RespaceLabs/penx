import { ReactNode } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { SpaceFooter } from '@/components/SpaceFooter'
import { getSpaceData } from '@/lib/fetchers'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { domain: string }
}): Promise<Metadata | null> {
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
}: {
  params: { domain: string }
  children: ReactNode
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const data = await getSpaceData(domain)

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

  return (
    <div>
      <div className="h-[56px] flex items-center justify-between px-3">
        <div className="">
          <Link
            href={`/@${domain}`}
            className="flex items-center justify-center"
          >
            <div className="inline-flex h-8 w-8 rounded-full align-middle">
              <Image
                alt={data.name || ''}
                layout="responsive"
                height={40}
                width={40}
                src={data.logo || ''}
              />
            </div>
            <span className="ml-3 inline-block truncate font-title font-medium text-foreground">
              {data.name}
            </span>
          </Link>
        </div>
        <Profile />
      </div>

      <div className="mt-20">{children}</div>

      <SpaceFooter />
    </div>
  )
}
