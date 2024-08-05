import BlurImage from '@/components/blur-image'
import { placeholderBlurhash, toDateString } from '@/lib/utils'
import type { Post } from '@prisma/client'
import Link from 'next/link'

interface BlogCardProps {
  data: Pick<
    Post,
    'slug' | 'image' | 'imageBlurhash' | 'title' | 'description' | 'createdAt'
  >
  domain: string
}

export default function BlogCard({ domain, data }: BlogCardProps) {
  return (
    <Link href={`/@${domain}/${data.slug}`}>
      <div className="ease overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800">
        <BlurImage
          src={data.image || '/placeholder.png'}
          alt={data.title ?? 'Blog Post'}
          width={500}
          height={400}
          className="h-52 w-full object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="h-36 border-t border-stone-200 px-5 py-8 dark:border-stone-700 dark:bg-black">
          <h3 className="font-title text-xl tracking-wide dark:text-white">
            {data.title}
          </h3>
          <p className="text-md my-2 truncate italic text-stone-600 dark:text-stone-400">
            {data.description}
          </p>
          <p className="my-2 text-sm text-stone-600 dark:text-stone-400">
            Published {toDateString(data.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}
