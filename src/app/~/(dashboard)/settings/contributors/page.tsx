'use client'

import AddContributor from './AddContributor'
import ContributorList from './ContributorList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex flex-col justify-between space-y-8">
      <AddContributor />
      <ContributorList />
    </div>
  )
}
