import Markdown from 'react-markdown'
import { Box } from '@fower/react'
import { useCommandAppUI } from '~/hooks/useCommandAppUI'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'

interface CommandAppProps {}

export function CommandApp({}: CommandAppProps) {
  const { currentCommand } = useCurrentCommand()
  const { ui } = useCommandAppUI()
  console.log('======currentCommand:', currentCommand)

  if (ui.type === 'markdown') {
    return <Markdown>{ui.content}</Markdown>
  }

  return <Box p4>TODO</Box>
}
