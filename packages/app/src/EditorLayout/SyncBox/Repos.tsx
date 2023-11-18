import { useEffect } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { LockKeyhole } from 'lucide-react'
import { useAccount } from 'wagmi'
import { Card, Spinner } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'
import { GitHubConnectButton } from './GitHubConnectButton'

interface Props {
  token: string
  q: string
  installationId: number
}

export function Repos({ installationId, q, token }: Props) {
  const {
    data = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery(['searchRepo'], () =>
    trpc.github.searchRepo.query({
      q,
      installationId: Number(installationId),
      token,
    }),
  )

  useEffect(() => {
    refetch()
  }, [installationId, refetch])

  const h = 383

  if (isLoading) {
    return (
      <Card h={h} toCenter>
        <Box toCenterY gap2>
          <Spinner />
          <Box>Loading repos...</Box>
        </Box>
      </Card>
    )
  }

  // if (!data?.length) {
  //   return (
  //     <Card toCenter gray400 h={h}>
  //       No repos found
  //     </Card>
  //   )
  // }

  return (
    <Box column gap2 border borderGray100 mt2 roundedXL>
      {data.map((item) => (
        <Box
          key={item.id}
          toBetween
          toCenterY
          borderBottom
          borderBottomGray100
          px4
          py3
        >
          <Box toCenterY gap1>
            <Box textBase>{item.name}</Box>
            {item.private && (
              <Box gray600>
                <LockKeyhole size={16} />
              </Box>
            )}
          </Box>
          <GitHubConnectButton
            installationId={installationId}
            repo={item.full_name}
          />
        </Box>
      ))}
    </Box>
  )
}
