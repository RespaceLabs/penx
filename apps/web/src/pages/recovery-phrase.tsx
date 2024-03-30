import React from 'react'
import { Box } from '@fower/react'
import { RecoveryPhrase } from '~/components/RecoveryPhrase/RecoveryPhrase'
import { CommonLayout } from '~/layouts/CommonLayout'

const PagePassword = () => {
  return (
    <Box h-100vh toCenter>
      <RecoveryPhrase />
    </Box>
  )
}

export default PagePassword

PagePassword.Layout = CommonLayout
