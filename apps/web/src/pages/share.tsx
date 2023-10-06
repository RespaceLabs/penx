import React, { useEffect } from 'react'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { decryptString } from '@penx/app/src/encryption'
import { api } from '~/utils/api'

const PageShare = () => {
  const router = useRouter()
  const { id } = router.query
  const sharedDoc = api.sharedDoc.byId.useQuery({ id: id as string })

  useEffect(() => {
    const decryptedText =
      sharedDoc.data?.content && decryptString(sharedDoc.data.content)
    const decryptedJson = decryptedText ? JSON.parse(decryptedText) : null
    console.log('source:', sharedDoc.data?.content)
    console.log('decryptedJson:', decryptedJson)
  }, [sharedDoc])

  return (
    <Box>
      <Box mb16>share demo</Box>
    </Box>
  )
}

export default PageShare
