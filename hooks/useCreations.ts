import { PENX_SUBGRAPH_URL } from '@/lib/constants'
import { Creation } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useCreations(space: string) {
  const query = gql`
    query geCreations($space: Bytes!) {
      creations(where: { space: $space }) {
        id
        creationId
        space
        creator
        space
        mintedAmount
      }
    }
  `

  const { data, ...rest } = useQuery<{ creations: Creation[] }>({
    queryKey: ['creations', space],
    async queryFn() {
      return request({
        url: PENX_SUBGRAPH_URL,
        document: query,
        variables: {
          space: space,
        },
      })
    },
    enabled: !!space,
  })

  return {
    creations: data?.creations,
    ...rest,
  }
}
