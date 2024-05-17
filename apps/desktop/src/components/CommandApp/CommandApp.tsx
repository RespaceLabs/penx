import Markdown from 'react-markdown'
import { Box } from '@fower/react'
import { useCommandAppUI } from '~/hooks/useCommandAppUI'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { Marketplace } from './Marketplace'

interface CommandAppProps {}

export function CommandApp({}: CommandAppProps) {
  const { currentCommand } = useCurrentCommand()
  const { ui } = useCommandAppUI()
  console.log('======currentCommand:', currentCommand)

  if (ui.type === 'markdown') {
    return (
      <Box p4>
        <Markdown>{ui.content}</Markdown>
      </Box>
    )
  }

  if (ui.type === 'marketplace') {
    return <Marketplace />
  }

  return <Box p4>TODO</Box>
}
