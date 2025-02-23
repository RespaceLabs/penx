import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageDefaultUI } from '@/components/theme-ui/PageDefaultUI'
import { getPage, getPost, getPosts, getSite } from '@/lib/fetchers'
import { GateType } from '@/lib/types'
import { Post } from '@/server/db/schema'
import { loadTheme } from '@/themes/theme-loader'

export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: any
}): Promise<Metadata> {
  const slug = decodeURI((await params).slug.join('/'))
  const page = await getPage(slug)

  return {
    title: page?.title,
    description: page?.title,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const slug = decodeURI((await params).slug.join('/'))
  const [page, site] = await Promise.all([getPage(slug), getSite()])

  if (!page) return notFound()

  const { PageDetail } = loadTheme(site.themeName)
  if (!PageDetail) return <PageDefaultUI content={page.content} />

  return <PageDetail content={page.content} page={page} />
}
