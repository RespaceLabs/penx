'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { useSpaces } from '@/hooks/useSpaces'
import { useEnableSponsor } from './hooks/useEnableSponsor'

export function EnableSponsorButton() {
  const { space } = useSpaces()
  const { isLoading, enable } = useEnableSponsor()

  return (
    <div className="text-center space-y-2">
      <Button
        size="lg"
        disabled={isLoading}
        className="h-14 rounded-3xl w-[230px]"
        onClick={async () => {
          if (isLoading) return
          await enable(space.id)
        }}
      >
        {isLoading ? <LoadingDots color="white" /> : 'Enable Sponsor Feature'}
      </Button>
      <div className="text-neutral-500">How it works?</div>
    </div>
  )
}
