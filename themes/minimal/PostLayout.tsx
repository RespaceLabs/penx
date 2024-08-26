import { PropsWithChildren } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { SpaceFooter } from '@/components/SpaceFooter'
import { Space } from '@/theme-helper/types'
import Image from 'next/image'
import Link from 'next/link'

interface PostLayoutProps {
  space: Space
}

export function PostLayout({
  children,
  space,
}: PropsWithChildren<PostLayoutProps>) {
  return (
    <div>
      <div className="h-[56px] flex items-center justify-between px-3">
        <div>
          <Link
            href={`/@${space.subdomain}`}
            className="flex items-center justify-center"
          >
            <div className="inline-flex h-8 w-8 rounded-full align-middle">
              <Image
                alt={space.name || ''}
                layout="responsive"
                height={40}
                width={40}
                src={
                  space.logo ||
                  'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
                }
              />
            </div>
            <span className="ml-3 inline-block truncate font-title font-medium text-foreground">
              {space.name}
            </span>
          </Link>
        </div>
        <Profile />
      </div>

      <div className="mt-20">{children}</div>
    </div>
  )
}
