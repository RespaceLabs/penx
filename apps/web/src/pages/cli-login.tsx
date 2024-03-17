import React from 'react'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { Button, toast } from 'uikit'
import { api } from '@penx/trpc-client'

export default function CliLogin() {
  const { query, push } = useRouter()
  const token = (query?.token as string) || ''

  return (
    <Box p10 h-100vh toCenter column bgWhite black gap4>
      <Box text3XL fontBold>
        Login to PenX CLI
      </Box>
      <Box gray500>Please confirm your authorization for this login.</Box>

      <Box toCenterY gap2 mt6>
        <Button
          variant="outline"
          colorScheme="white"
          w-160
          onClick={() => {
            console.log('close....')
            window.close()
          }}
        >
          Cancel
        </Button>
        <Button
          w-160
          onClick={async () => {
            try {
              await api.user.confirmCLILogin.mutate({ token })
            } catch (error) {
              toast.error('please try again')
            }
          }}
        >
          Authorize CLI login
        </Button>
      </Box>
    </Box>
  )
}
