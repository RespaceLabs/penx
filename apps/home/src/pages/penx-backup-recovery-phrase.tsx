import { FC, PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'

export default function PageApp() {
  return (
    <Box textLG py20 leadingNormal maxW-1200 mx-auto column gap4>
      <Box text3XL fontBold>
        How to backup PenX Recovery phrase to Google drive?
      </Box>
      <video controls>
        <source src="/penx-backup-recovery-phrase.mov" />
        Your browser does not support the video tag.
      </video>
    </Box>
  )
}
