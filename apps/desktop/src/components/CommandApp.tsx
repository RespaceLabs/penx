import Markdown from 'react-markdown'
import { Box } from '@fower/react'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useDetail } from '~/hooks/useItems'

interface CommandAppProps {
  // detail: string
}
export function CommandApp({}: CommandAppProps) {
  const { currentCommand } = useCurrentCommand()
  const { detail } = useDetail()
  console.log('======currentCommand:', currentCommand)

  return (
    <Box>
      {detail && (
        <Box p4>
          <Markdown>{detail}</Markdown>
        </Box>
      )}
    </Box>
  )
}
