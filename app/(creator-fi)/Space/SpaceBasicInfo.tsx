'use client'

import { Button } from '@/components/ui/button'
import { SpaceType } from '@/lib/types'
import { getUrl } from '@/lib/utils'

interface Props {
  space: SpaceType
}

export function SpaceBasicInfo({ space }: Props) {
  return (
    <div className="flex items-center gap-2">
      <img
        alt={space.name || ''}
        className="h-9 w-9 rounded-lg bg-foreground shadow-sm"
        src={getUrl(space.logo)}
      />

      <div className="text-lg font-bold">{space.name}</div>
      {/* <SpaceAddress /> */}
      <Button size="sm" variant="secondary" className="rounded-full">
        <a
          href={`https://www.respace.one/space/${space.address}`}
          className="flex items-center gap-1"
          target="_blank"
        >
          <span>See in</span>
          <span className="text-brand-500">respace.one</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
      </Button>
      {/* <div className="text-sm text-secondary-foreground">
        {space.description || 'No description yet.'}
      </div> */}
    </div>
  )
}
