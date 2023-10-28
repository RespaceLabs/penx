import React, { useEffect } from 'react'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { decryptString } from '@penx/encryption'
import { api } from '~/utils/api'

const PageShare = () => {
  const router = useRouter()
  const { id, key } = router.query
  const sharedDoc = api.sharedDoc.byId.useQuery({ id: id as string })

  useEffect(() => {
    // const decryptedText =
    //   sharedDoc.data?.content &&
    //   decryptString(sharedDoc.data.content, key as string)
    // const decryptedJson = decryptedText ? JSON.parse(decryptedText) : null
    // console.log('decryptedJson:', decryptedJson)
  }, [])

  return (
    <Box>
      <Box mb16>share demo</Box>
    </Box>
  )
}

export default PageShare
