import { Post, Site } from '@/lib/theme.types'
import { AboutCard } from './AboutCard'
import { MostPopular } from './MostPopular'

interface Props {
  site: Site
  posts: Post[]
}

export const Sidebar = ({ site, posts }: Props) => {
  return (
    <div className="sm:w-[340px] w-full flex-shrink-0 space-y-20">
      <MostPopular posts={posts} />
      <AboutCard site={site} />
    </div>
  )
}
