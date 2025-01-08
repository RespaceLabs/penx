import { Suspense } from 'react'
import { MembershipPage } from './MembershipPage'

export default function Page() {
  return (
    <Suspense>
      <MembershipPage />
    </Suspense>
  )
}
