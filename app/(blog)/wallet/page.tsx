import { Wallet } from './Wallet/Wallet'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function Page() {
  return (
    <div className="pt-10 mx-auto md:max-w-3xl">
      <Wallet />
    </div>
  )
}
