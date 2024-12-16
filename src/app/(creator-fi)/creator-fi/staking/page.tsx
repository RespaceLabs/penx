'use client'

import { StakingPanel } from './StakingPanel'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex justify-center">
      <StakingPanel />
    </div>
  )
}
