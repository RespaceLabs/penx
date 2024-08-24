'use client'

import { AddContributorDialog } from './AddContributorDialog/AddContributorDialog'
import { ContributorList } from './ContributorList'
import { GiveShareDialog } from './GiveShareDialog/GiveShareDialog'

export default function Page() {
  return (
    <div>
      <AddContributorDialog />
      <GiveShareDialog />
      <ContributorList />
    </div>
  )
}
