import { PlanList } from '@/app/(creator-fi)/creator-fi/plans/PlanList'
import { SpaceProvider } from '@/components/SpaceContext'
import { getSite, getSpace } from '@/lib/fetchers'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function HomePage() {
  const [site] = await Promise.all([getSite()])

  if (!site?.spaceId) return null
  const space = await getSpace(site.spaceId)

  return (
    <SpaceProvider space={space}>
      <Link
        href="/"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-foreground/5 mt-2 ml-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          // width="1em"
          // height="2em"
          viewBox="0 0 12 24"
          className="h-6"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"
          ></path>
        </svg>
      </Link>

      <div className="flex flex-col items-center space-x-2 pt-8">
        {site.logo && (
          <Image
            src={site.logo}
            alt="avatar"
            width={192}
            height={192}
            className="h-20 w-20 rounded-full"
          />
        )}
        <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
          {site.name}
        </h3>
      </div>

      <div className="flex flex-col items-center space-x-2 pt-8 gap-10">
        <div className="text-center text-4xl font-bold">
          Choose a subscription plan
        </div>
        <PlanList />
      </div>
    </SpaceProvider>
  )
}
