import { ReactNode } from 'react'
import { getSpaceData } from '@/lib/fetchers'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getTheme } from '../getTheme'

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
    image = '',
    logo = '',
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
    // icons: [logo],
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
  const space = await getSpaceData(domain)
  const headerList = headers()

  if (!space) {
    notFound()
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    space.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === 'true'
  ) {
    return redirect(`https://${space.customDomain}`)
  }

  const { HomeLayout: SpaceLayout } = getTheme(space.themeName)
  if (!SpaceLayout) return <>{children}</>
  return <SpaceLayout space={space}>{children}</SpaceLayout>
}
