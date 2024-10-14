import { SubscriptionRecord, Trade } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import { useSpace } from './useSpace'

export function useSubscriptionRecords() {
  const { space } = useSpace()

  const query = gql`
    query getSubscriptionRecords($spaceAddress: String!) {
      subscriptionRecords(first: 100, where: { space: $spaceAddress }) {
        id
        planId
        type
        account
        duration
        amount
        timestamp
        space {
          id
          address
        }
      }
    }
  `

  const { data, ...rest } = useQuery<{
    subscriptionRecords: SubscriptionRecord[]
  }>({
    queryKey: ['subscriptionRecords', space.address],
    async queryFn() {
      return request({
        url: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
        document: query,
        variables: {
          spaceAddress: space.address!?.toLowerCase(),
        },
      })
    },
  })

  const records: SubscriptionRecord[] = data?.subscriptionRecords || []

  return { records, ...rest }
}
