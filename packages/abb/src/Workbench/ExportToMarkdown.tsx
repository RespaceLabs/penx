import { Box } from '@fower/react'
import { Avatar, AvatarFallback, MenuItem } from 'uikit'
import { Node } from '@penx/model'
import { docToMarkdown } from '@penx/shared'

interface Props {
  node: Node
}

export const ExportToMarkdown = ({ node }: Props) => {
  function exportMarkdown() {
    // const downloadLink = document.createElement('a')
    // const md = docToMarkdown(doc)
    // const file = new Blob([md], { type: 'text/plain' })
    // downloadLink.href = URL.createObjectURL(file)
    // downloadLink.download = `${doc.title}.md`
    // downloadLink.click()
  }
  return (
    <MenuItem gap2 onClick={exportMarkdown}>
      <Avatar size={20}>
        <AvatarFallback bgBlack>M</AvatarFallback>
      </Avatar>
      <Box>Export to Markdown</Box>
    </MenuItem>
  )
}
