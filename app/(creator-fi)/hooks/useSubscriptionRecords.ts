import { useSpaceContext } from '@/components/SpaceContext'
import { RESPACE_SUBGRAPH_URL } from '@/lib/constants'
import { SubscriptionRecord, Trade } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useSubscriptionRecords() {
  const space = useSpaceContext()

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
        url: RESPACE_SUBGRAPH_URL,
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
