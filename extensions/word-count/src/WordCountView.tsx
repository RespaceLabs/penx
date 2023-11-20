import { Box } from '@fower/react'
import { useNodeContext } from '@penx/hooks'

function countWords(text: string): number {
  const words = text.match(/[\u4e00-\u9fa5]|\w+/g)
  return words ? words.length : 0
}

export function WordCountView() {
  const { nodeService, node } = useNodeContext()

  if (!node.raw) return null

  return (
    <Box toCenterY gap2>
      <Box gray400>{countWords(nodeService.markdownContent)} words</Box>
      <Box gray400>{nodeService.markdownContent.length} characters</Box>
    </Box>
  )
}
