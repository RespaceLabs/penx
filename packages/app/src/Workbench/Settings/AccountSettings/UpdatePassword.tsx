import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { Title } from './Title'
import {
  UpdatePasswordDrawer,
  UpdatePasswordModal,
} from './UpdatePasswordModal'

export const UpdatePassword = () => {
  return (
    <Box>
      <Title text="Update password" />

      <Box>
        <Box gray400>Update the password for your account.</Box>
        {isMobile ? <UpdatePasswordDrawer /> : <UpdatePasswordModal />}
      </Box>
    </Box>
  )
}
