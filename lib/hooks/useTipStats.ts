import { PENX_SUBGRAPH_URL } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

type TipInfo = {
  id: string
  totalAmount: string
  uri: string
}

export function useTipStats(receivers: string[] = []) {
  const query = gql`
    query geTips($receivers: [Bytes]) {
      tips(where: { receiver_in: $receivers }) {
        id
        totalAmount
        uri
      }
    }
  `

  const { data, ...rest } = useQuery<{ tips: TipInfo[] }>({
    queryKey: ['tips', receivers],
    async queryFn() {
      return request({
        url: PENX_SUBGRAPH_URL,
        document: query,
        variables: {
          receivers,
        },
      })
    },
    enabled: receivers.length > 0,
  })

  return {
    data: data?.tips,
    ...rest,
  }
}
