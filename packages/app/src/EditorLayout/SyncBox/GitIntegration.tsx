import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { useSpaces, useUser } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'
// import { api, RouterOutputs } from '~/utils/api'
import { GithubConnectedBox } from './GitHubConnectedBox'
import { GithubInstallationSelect } from './GitHubInstallationSelect'
import { Repos } from './Repos'

interface Props {
  token: RouterOutputs['github']['token']
}

export function GitIntegration({ token }: Props) {
  const { user } = useUser()
  const { activeSpace } = useSpaces()
  const { data: installations } = useQuery(['appInstallations'], () =>
    trpc.github.appInstallations.query({
      token: token?.ghToken!,
    }),
  )

  // console.log('==========installations:', installations)

  const [installationId, setInstallationId] = useState<number>()
  const [q, setQ] = useState<string>('')
  const debouncedSetQ = useDebouncedCallback(async (val) => {
    return setQ(val)
  }, 500)

  useEffect(() => {
    if (installations?.length && !installationId) {
      setInstallationId(installations[0].installationId)
    }
  }, [installations, installationId])

  if (!user.raw) return null

  const repo = user.getRepoName(activeSpace.id)
  if (repo) {
    return <GithubConnectedBox repo={repo} />
  }

  return (
    <Box mt2 column gapY4>
      <Box toBetween gapX3>
        <GithubInstallationSelect
          token={token?.ghToken!}
          value={installationId!}
          onChange={(v: number) => setInstallationId(v)}
        />
        <Input
          placeholder="Search..."
          flex-1
          onChange={(e) => debouncedSetQ(e.target.value)}
        />
      </Box>
      {installationId && (
        <Repos token={token?.ghToken!} q={q} installationId={installationId} />
      )}
    </Box>
  )
}
