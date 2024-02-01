import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useAccount, useContractRead } from 'wagmi'
import { Avatar, AvatarFallback, AvatarImage, Button, Skeleton } from 'uikit'
import { penxPointAbi } from '@penx/abi'
import { IconGitHub } from '@penx/icons'
import { precision } from '@penx/math'
import { api, trpc } from '@penx/trpc-client'
import { addressMap } from '@penx/wagmi'
import { BindGitHubButton } from './BindGitHubButton'

interface TaskGithub {
  accountId: number
}

interface GitHubInfoProps {
  githubAccountId: number
}

function GitHubInfo({ githubAccountId }: GitHubInfoProps) {
  const { isLoading, data } = useQuery(['github_user'], () =>
    ky.get(`https://api.github.com/user/${githubAccountId}`).json<any>(),
  )

  const { refetch } = trpc.user.me.useQuery()

  if (isLoading) return null

  return (
    <Box toCenterY gap2>
      <Box relative>
        <Avatar>
          <AvatarImage src={data.avatar_url} />
        </Avatar>
        <IconGitHub
          size={18}
          absolute
          bottom--2
          right--4
          gray500
          zIndex-1
          bgWhite
          border-1
          roundedFull
        />
      </Box>
      <Box>{data.name}</Box>
      <Box
        textXS
        bgNeutral200
        bgNeutral200--D2--hover
        cursorPointer
        roundedFull
        px2
        py1
        gray400
        onClick={async () => {
          await api.user.disconnectTaskGithub.mutate()
          refetch()
        }}
      >
        Disconnect
      </Box>
    </Box>
  )
}

function PointBalance() {
  const { address } = useAccount()

  const { data, isLoading, error } = useContractRead({
    address: addressMap.PenxPoint,
    abi: penxPointAbi,
    functionName: 'balanceOf',
    args: [address!],
  })

  if (isLoading) {
    return (
      <Box column w-200>
        <Skeleton h-36 />
      </Box>
    )
  }

  return (
    <Box toCenterY gap2>
      <Box fontBold text2XL>
        {precision.toTokenDecimal(data!)} PXP
      </Box>

      <Box textSM gray800 gray500>
        (My PenX Points)
      </Box>
    </Box>
  )
}

export function TaskUserProfile() {
  const { isConnected, address = '' } = useAccount()
  const { data: user, isLoading } = trpc.user.me.useQuery()

  if (isLoading) {
    return (
      <Box column toBetween w-200>
        <Box column gap2>
          <Skeleton h-30 />
          <Skeleton h-30 />
        </Box>
        <Skeleton h-36 />
      </Box>
    )
  }

  const taskGithub: TaskGithub = user?.taskGithub as any

  return (
    <Box column gap2 toBetween>
      <Box column gap3>
        <Box toCenterY gap2>
          <Avatar>
            <AvatarImage />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <Box>
            {address.slice(0, 12)}...{address.slice(-4)}
          </Box>
        </Box>
        {isConnected && <PointBalance></PointBalance>}
      </Box>
      {!taskGithub?.accountId && <BindGitHubButton />}
      {taskGithub?.accountId && (
        <GitHubInfo githubAccountId={taskGithub.accountId} />
      )}
    </Box>
  )
}
