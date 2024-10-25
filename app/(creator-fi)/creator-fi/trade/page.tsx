import { Transaction } from '../../Space/Transaction'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default function Page() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="w-full space-y-8 md:w-[480px]">
        <div className="text-center text-4xl font-bold">Trade token</div>
        <Transaction />
      </div>
    </div>
  )
}
