import { useRef } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { Octokit } from 'octokit'
import { Avatar, AvatarImage, Button, Spinner } from 'uikit'
import { useUser } from '@penx/hooks'
import { CommitList } from './CommitList'

interface CommitListContainerProps {
  date: Date
  token: string
}

export function CommitListContainer({ token, date }: CommitListContainerProps) {
  const { user } = useUser()
  // console.log('========date:', date, startOfDay(date))

  const octoRef = useRef(new Octokit({ auth: token }))

  const { data, isLoading } = useQuery(
    ['commits', token, date.toISOString()],
    () =>
      octoRef.current.request('GET /repos/{owner}/{repo}/commits', {
        owner: user.repoOwner,
        repo: user.repoName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        since: startOfDay(date).toISOString(),
        until: endOfDay(date).toISOString(),
      }),
  )

  if (isLoading) {
    return (
      <Box border roundedXL p5 maxW-800>
        <Spinner></Spinner>
      </Box>
    )
  }

  return (
    <Box border roundedXL p5 maxW-800>
      {!data?.data?.length && <Box gray400>No commits</Box>}
      {data?.data && <CommitList commits={data.data as any} />}
    </Box>
  )
}
