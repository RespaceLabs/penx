'use client'

import { AddContributorDialog } from './AddContributorDialog/AddContributorDialog'
import { ContributorList } from './ContributorList'

export default function Page() {
  return (
    <div>
      <AddContributorDialog />
      <ContributorList />
    </div>
  )
}
