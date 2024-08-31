import { Space } from '@prisma/client'
import Editor from '@/components/editor/advanced-editor'
import { useMemo } from 'react'
import { defaultValue } from '@/components/Post/default-value'
import { useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { useDebouncedCallback } from 'use-debounce'
import { useSpace } from '@/hooks/useSpace'

export const About = () => {
  const { data: session } = useSession()
  const { space, setState } = useSpace()

  const content = useMemo(() => {
    return space.about ? JSON.parse(space.about) : defaultValue
  }, [space.about])

  const { mutateAsync } = trpc.space.update.useMutation()

  const debounced = useDebouncedCallback(
    async (value: string) => {
      try {
        await mutateAsync({
          id: space.id,
          about: value,
        })

        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          space: {
            ...prevState.space,
            about: value
          },
        }))
      } catch (error) {
        console.error('error', error)
      }
    }, 400)

  return <Editor
    initialValue={content}
    editable={session?.userId === space?.userId}
    onChange={(v) => {
      debounced(JSON.stringify(v))
    }}
  />
}