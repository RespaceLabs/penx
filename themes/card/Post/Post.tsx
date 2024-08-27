import BlurImage from '@/components/blur-image'
import { Badge } from '@/components/ui/badge'
import { PostType } from '@/lib/constants'
import { toDateString } from '@/lib/utils'
import { PostProps } from '@/theme-helper/types'
import Image from 'next/image'
import { ImageCreation } from './ImageCreation'
import { PostCreation } from './PostCreation'

export function Post({ post, isGated }: PostProps) {
  return (
    <div className="pb-20 min-h-[72vh]">
      <div className="flex flex-col mx-auto w-[720px]">
        {post.image && (
          <Image
            src={post.image}
            width={800}
            height={800}
            className="w-full h-[360px] mb-10 rounded-xl"
            alt=""
          />
        )}

        <div>
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 dark:text-white md:text-6xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center font-semibold">
            <div className="h-10 w-10 rounded-full inline-flex">
              <BlurImage
                alt={post.space!.name ?? 'User Avatar'}
                src={
                  post.space!.logo ||
                  'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
                }
                layout="responsive"
                className="rounded-full"
                height={40}
                width={40}
              />
            </div>

            <div>{post.space?.name}</div>

            <div>
              <Badge variant="secondary" className="inline-flex py-1">
                {toDateString(post.createdAt)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <PostTradeModal space={post.space} post={post} /> */}
          </div>
        </div>

        {post.type === PostType.ARTICLE && (
          <PostCreation canRead={!isGated} post={post} />
        )}

        {post.type === PostType.IMAGE && (
          <ImageCreation canRead={!isGated} post={post} />
        )}
      </div>
    </div>
  )
}
