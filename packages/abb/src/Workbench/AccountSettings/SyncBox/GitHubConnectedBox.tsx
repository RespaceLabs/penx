import { Box } from '@fower/react'
import { Link } from 'lucide-react'
import { IconGitHub } from '@penx/icons'
import { DisconnectPopover } from './DisconnectPopover'

interface Props {
  repo: string
}

export function GithubConnectedBox({ repo }: Props) {
  return (
    <Box toBetween toCenterY border borderGray100 roundedXL p4>
      <Box toCenterY gap2>
        <IconGitHub />
        <Box textBase>{repo}</Box>
        <Box as="a" href={`https://github.com/${repo}`} target="_blank">
          <Link size={16} />
        </Box>
      </Box>
      <DisconnectPopover />
    </Box>
  )
}
