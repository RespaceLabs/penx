'use client'

import { PlanList } from './PlanList'

export default function Page() {
  return (
    <div className="space-y-10 pt-20">
      <div className="text-center text-5xl font-bold">
        Choose a subscription plan
      </div>
      <PlanList />
    </div>
  )
}
