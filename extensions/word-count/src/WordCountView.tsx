import { Box } from '@fower/react'
import { useDoc } from '@penx/hooks'

function countWords(text: string): number {
  const words = text.match(/[\u4e00-\u9fa5]|\w+/g)
  return words ? words.length : 0
}

export function WordCountView() {
  const { docService, doc } = useDoc()

  if (!doc.raw) return null

  return (
    <Box toCenterY gap2>
      <Box gray400>{countWords(docService.markdownContent)} words</Box>
      <Box gray400>{docService.markdownContent.length} characters</Box>
    </Box>
  )
}
