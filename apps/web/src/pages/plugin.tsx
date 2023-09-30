import React, { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { api } from '~/utils/api'

const PageEditor = () => {
  const pluginCreate = api.plugin.create.useMutation()

  const onAdd = async () => {
    console.log('onAdd')

    try {
      const res = await pluginCreate.mutateAsync({
        name: 'My Plugin',
        author: 'John Doe',
        description: 'My plugin description',
        repo: 'https://github.com/my-plugin-repo',
        version: '1.0.0',
        downloads: 0,
        updated: '2023-09-29',
      })

      console.log('res', res)
    } catch (error) {
      console.error('Failed to create plugin:', error)
    }
  }

  return (
    <Box>
      <Box mb16>Plugin demo</Box>
      <Box>
        <Box onClick={onAdd} as="button" w="50" h="50">
          {' '}
          Add{' '}
        </Box>
      </Box>
    </Box>
  )
}

export default PageEditor
