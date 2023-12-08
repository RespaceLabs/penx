import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  MenuItem,
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'uikit'
import { useSpaces } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'

interface Props {
  token: string
  value: number
  onChange: (value: number) => void
}

export function GithubInstallationSelect({ token, value, onChange }: Props) {
  const { activeSpace } = useSpaces()
  const spaceId = activeSpace.id

  const { data: installations } = useQuery(['spaceInstallations'], () =>
    trpc.github.appInstallations.query({
      token,
    }),
  )

  console.log('installations:', installations)

  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME
  const newAppURL = `https://github.com/apps/${appName}/installations/new?state=${spaceId}`

  return (
    <Select value={value} onChange={(v: number) => onChange(v)}>
      <SelectTrigger bgSlate100 flex-1>
        <SelectValue placeholder="Select a account"></SelectValue>
        <SelectIcon></SelectIcon>
      </SelectTrigger>
      <SelectContent w-200>
        {installations?.map((item) => (
          <SelectItem key={item.installationId} value={item.installationId}>
            <Avatar size="sm">
              <AvatarImage src={item.avatarUrl} />
              <AvatarFallback>{item.accountName}</AvatarFallback>
            </Avatar>
            {item.accountName}
          </SelectItem>
        ))}

        <MenuItem
          gapX1
          onClick={() => {
            location.href = newAppURL
          }}
        >
          <Box inlineFlex gray600>
            <Plus size={20} />
          </Box>
          <Box>Add GitHub Account</Box>
        </MenuItem>
      </SelectContent>
    </Select>
  )
}
