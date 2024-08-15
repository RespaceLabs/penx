import { Post, Space } from '@prisma/client'
import { TipTapNode, TipTapRender } from '@troop.com/tiptap-react-render'
import { CurationCard } from './CurationCard'
import { GateCover } from './GateCover'
import { handlers } from './handlers'
import { PostActionBar } from './PostActionBar'
import { PromotionCard } from './PromotionCard'

interface Props {
  canRead: boolean
  post: Post & {
    space: Space
  }
}

export function PostCreation({ canRead, post }: Props) {
  const node: TipTapNode = JSON.parse(post.content || '{}')
  const len = node.content?.length || 0

  // hided half of the content
  node.content = canRead
    ? node.content
    : node.content?.slice(1, parseInt((len * 0.5) as any)) || []

  return (
    <div className="relative min-h-[400px] mt-4">
      <div className="relative">
        <TipTapRender handlers={handlers} node={node} />
        {!canRead && <GateCover />}
      </div>

      <PostActionBar post={post} />

      <div className="grid gap-4 mt-8">
        {post.space.sponsorCount > 0 && <PromotionCard space={post.space} />}
        <CurationCard space={post.space} />
      </div>
    </div>
  )
}
