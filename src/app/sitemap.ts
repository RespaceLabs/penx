import { getPosts } from '@/lib/fetchers'
import { headers } from 'next/headers'

export default async function Sitemap() {
  const headersList = headers()
  const domain = headersList.get('host')

  const posts = await getPosts()

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...posts.map(({ slug }) => ({
      url: `https://${domain}/posts/${slug}`,
      lastModified: new Date(),
    })),
  ]
}
