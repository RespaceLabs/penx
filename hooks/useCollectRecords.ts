import { CREATION_SUBGRAPH_URL } from '@/lib/constants'
import { MintRecord } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useCollectRecords(creationId: string) {
  const query = gql`
    query getMintRecords($creationId: String!) {
      mintRecords(first: 100, where: { creationId: $creationId }) {
        id
        creationId
        minter
        curator
        amount
        price
      }
    }
  `

  const { data, ...rest } = useQuery<{
    mintRecords: MintRecord[]
  }>({
    queryKey: ['mintRecords', creationId],
    async queryFn() {
      return request({
        url: CREATION_SUBGRAPH_URL,
        document: query,
        variables: {
          creationId: creationId,
        },
      })
    },
  })

  const records: MintRecord[] = data?.mintRecords || []

  return { records, ...rest }
}
