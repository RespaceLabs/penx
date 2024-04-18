import React from 'react'
import { Box } from '@fower/react'
import { BasicLayout } from '~/layouts/BasicLayout'

const Page = () => {
  return (
    <Box minH="calc(100vh - 360px)" column gap8 toCenter>
      <Box text3XL fontBold>
        Currently, you can install the Penx PWA.
      </Box>
      <Box as="img" src="/images/penx-pwa-guide.png" rounded2XL shadowPopover />
    </Box>
  )
}

Page.Layout = BasicLayout

export default Page
