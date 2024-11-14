import { PENX_SUBGRAPH_URL } from '@/lib/constants'
import { TipRecord } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useTipRecords(uri: string, enabled: boolean) {
  const query = gql`
    query getTipRecords($uri: String!) {
      tipRecords(
        first: 1000
        orderBy: "timestamp"
        orderDirection: "desc"
        where: { uri: $uri }
      ) {
        id
        tipper
        receiver
        amount
        uri
        tipperRewardPercent
        timestamp
      }
    }
  `

  const { data, ...rest } = useQuery<{ tipRecords: TipRecord[] }>({
    queryKey: ['tipRecords', uri],
    async queryFn() {
      return request({
        url: PENX_SUBGRAPH_URL,
        document: query,
        variables: {
          uri,
        },
      })
    },
    enabled,
  })

  const records: TipRecord[] = data?.tipRecords || []

  return { records, ...rest }
}
