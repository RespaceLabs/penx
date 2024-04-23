import React from 'react'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { Button, Spinner, toast, ToastContainer } from 'uikit'
import { api, trpc, TrpcProvider } from '@penx/trpc-client'

export default function CliLogin() {
  const { query, push } = useRouter()
  const token = (query?.token as string) || ''

  const { isLoading: isCanceling, mutateAsync: cancel } =
    trpc.cli.cancelLogin.useMutation()

  const { isLoading: isConfirming, mutateAsync: confirm } =
    trpc.cli.confirmLogin.useMutation()

  return (
    <TrpcProvider>
      <ToastContainer position="bottom-right" />
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
            gap2
            disabled={isCanceling}
            onClick={async () => {
              if (isCanceling) return
              try {
                await cancel({ token })
                window.close()
              } catch (error) {
                toast.error('please try again')
              }
            }}
          >
            {isCanceling && <Spinner square5></Spinner>}
            <Box>Cancel</Box>
          </Button>
          <Button
            w-160
            disabled={isConfirming}
            onClick={async () => {
              try {
                await confirm({ token })
                toast.error('CLI login successfully')
              } catch (error) {
                toast.error('please try again~')
              }
            }}
          >
            {isConfirming && <Spinner square5></Spinner>}
            <Box>Authorize CLI login</Box>
          </Button>
        </Box>
      </Box>
    </TrpcProvider>
  )
}
