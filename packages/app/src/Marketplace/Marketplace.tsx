import { useEffect } from 'react'
import { Box } from '@fower/react'
import { trpc } from '@penx/trpc-client'

export function Marketplace() {
  useEffect(() => {
    trpc.extension.all.query().then((extensions) => {
      console.log('extensions:', extensions)
      //
    })
  }, [])
  return (
    <Box>
      <Box>GOGO market</Box>
    </Box>
  )
}
