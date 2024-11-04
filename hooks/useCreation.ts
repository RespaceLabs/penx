import { PLANTREE_SUBGRAPH_URL } from '@/lib/constants'
import { Creation } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useCreation(creationId: string) {
  const query = gql`
    query geCreation($creationId: String!) {
      creation(id: $creationId) {
        id
        creationId
        creator
        space
        mintedAmount
      }
    }
  `

  const { data, ...rest } = useQuery<{ creation: Creation }>({
    queryKey: ['creation', creationId],
    async queryFn() {
      return request({
        url: PLANTREE_SUBGRAPH_URL,
        document: query,
        variables: {
          creationId: creationId,
        },
      })
    },
    enabled: !!creationId,
  })

  return {
    creation: data?.creation,
    ...rest,
  }
}
