import { PlanList } from './PlanList'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function Page() {
  return (
    <div className="space-y-10 pt-20">
      <div className="text-center text-5xl font-bold">
        Choose a subscription plan
      </div>
      <PlanList />
    </div>
  )
}
