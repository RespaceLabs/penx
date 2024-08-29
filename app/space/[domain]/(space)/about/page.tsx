import { getSpaceData, getSpaceWithSponsors } from '@/lib/fetchers'
import { notFound } from 'next/navigation'
import { getTheme } from '../../getTheme'

// export const dynamic = 'force-static'
// export const dynamic = 'force-dynamic'

export default async function AboutPage({
  params,
}: {
  params: { domain: string }
}) {
  const domain = decodeURIComponent(params.domain).replace(/^@/, '')
  const space = await getSpaceData(domain)

  if (!space) {
    notFound()
  }

  const { About } = getTheme(space.themeName)
  if (!About) return null
  return <About space={space} />
}
