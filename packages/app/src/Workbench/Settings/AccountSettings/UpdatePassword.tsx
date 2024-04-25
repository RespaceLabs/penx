import { Box } from '@fower/react'
import { Button, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { Title } from './Title'
import { UpdatePasswordForm } from './UpdatePasswordForm'

export const UpdatePassword = () => {
  return (
    <Box>
      <Title text="Update password" />

      <Box>
        <Box gray400>Update the password for your account.</Box>
        <Popover placement="top-start">
          <PopoverTrigger>
            <Button colorScheme="white" mt3>
              Update password
            </Button>
          </PopoverTrigger>
          <PopoverContent p5 w-280>
            <UpdatePasswordForm />
          </PopoverContent>
        </Popover>
      </Box>
    </Box>
  )
}
