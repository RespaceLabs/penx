import React from 'react'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { ClientOnly } from '../ClientOnly'
import { WalletConnectProvider } from '../WalletConnectProvider'
import { InkBalance } from './InkBalance'

export function Main() {
  return (
    <Box column gap4 toCenterY>
      <Box column gap5 toCenter>
        <Box text8XL fontBold>
          $INK
        </Box>
        <Box textCenter column gap1>
          <Box text2XL>Your token memory when using PenX in early stage.</Box>
          <Box textBase gray400>
            $INK is not the PenX platform token, but you can get $PENX Airdrop
            in the future by holding $INK.
          </Box>
        </Box>
        <Box toCenterY gap2>
          <ClientOnly>
            <WalletConnectProvider>
              <InkBalance></InkBalance>
            </WalletConnectProvider>
          </ClientOnly>
          <Button variant="outline" colorScheme="black" size="lg" roundedFull>
            Contract in Arbitrum
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
