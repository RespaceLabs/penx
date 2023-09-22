import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Box } from '@fower/react'
import { produce } from 'immer'
import { Input } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'

interface Values {
  githubToken: string
  repo: string
  privateKey: string
}

export const Sync = () => {
  const { activeSpace } = useSpaces()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      ...activeSpace.settings?.sync,
    },
  })

  const values = watch()

  useEffect(() => {
    const settings = produce(activeSpace.settings, (draft) => {
      draft.sync = values
    })
    db.space.update(activeSpace.id, {
      settings,
    })
  }, [values])

  console.log('values:', values)

  const onSubmit: SubmitHandler<Values> = async (data) => {
    //
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} column gap6>
      <Box column gap2>
        <Box fontSemibold>GitHub Token</Box>
        <Box textSM gray500>
          Your GitHub token
        </Box>
        <Controller
          name="githubToken"
          control={control}
          render={({ field }) => <Input placeholder="" {...field} />}
        />
      </Box>

      <Box column gap2>
        <Box fontSemibold>Repository</Box>
        <Box textSM gray500>
          GitHub Repository to sync
        </Box>

        <Controller
          name="repo"
          control={control}
          render={({ field }) => (
            <Input placeholder="0xZion/my-penx-repo" {...field} />
          )}
        />
      </Box>
    </Box>
  )
}
