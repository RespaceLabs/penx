import { Post } from '@/theme-helper/types'
import Image from 'next/image'

interface Props {
  canRead: boolean
  post: Post
}

export function ImageCreation({ post }: Props) {
  return (
    <Image
      src={post.content || ''}
      height={1000}
      width={1000}
      className="w-full h-auto mt-5"
      alt=""
    />
  )
}
