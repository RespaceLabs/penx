'use client'

import { trpc } from '@/lib/trpc'
import AccessTokenCreateForm from './CreateForm'
import AccessTokenList from './TokenList'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, data, refetch } = trpc.accessToken.list.useQuery()

  return (
    <div className="flex flex-col justify-between space-y-8">
      <AccessTokenList
        tokenList={data}
        isLoading={isLoading}
        refetch={refetch}
      />
      <AccessTokenCreateForm refetch={refetch} />
    </div>
  )
}
