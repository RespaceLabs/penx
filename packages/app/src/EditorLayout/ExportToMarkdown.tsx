import React from 'react'
import { Box } from '@fower/react'
import { Avatar, AvatarFallback, MenuItem } from 'uikit'
import { docToMarkdown } from '@penx/shared'
import { IDoc } from '@penx/types'

interface Props {
  doc: IDoc
}

export const ExportToMarkdown = ({ doc }: Props) => {
  function exportMarkdown() {
    const downloadLink = document.createElement('a')
    const md = docToMarkdown(doc)
    const file = new Blob([md], { type: 'text/plain' })
    downloadLink.href = URL.createObjectURL(file)
    downloadLink.download = `${doc.title}.md`
    downloadLink.click()
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
