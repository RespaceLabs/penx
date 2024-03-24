import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { Button, Input, InputGroup, Spinner } from 'uikit'
import { useUser } from '@penx/hooks'
import { useAccessCodeForm } from './useAccessCodeForm'

export const EarlyAccessCode = () => {
  const form = useAccessCodeForm()
  const { control, formState, loading } = form
  const { data } = useSession()
  const { isValid } = formState
  const account = data?.address || data?.email

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap8 w={['100%', 400, 520]}>
      <Box>
        <Box text4XL fontBold textCenter mb4>
          Early access code
        </Box>
        <Box textCenter gray600 leadingNormal>
          <Box>
            Penx is currently in the early stage. Join{' '}
            <Box
              as="a"
              target="_blank"
              href="https://discord.gg/nyVpH9njDu"
              brand500
              fontSemibold
            >
              Discord
            </Box>{' '}
            to get an early access code. To get the code, in{' '}
            <Box as="span" fontBold>
              early-access-code
            </Box>{' '}
            channel to enter:{' '}
          </Box>

          <Box mt2>
            <Box black bgGray100 inlineFlex px4 py2 roundedFull>
              /code {account}
            </Box>
          </Box>
        </Box>
      </Box>

      <Controller
        name="code"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <InputGroup>
            <Input
              size={56}
              flex-1
              borderNone
              shadowPopover
              roundedFull
              textBase
              // shadow3XL
              placeholder="Enter early access code"
              {...field}
            />
          </InputGroup>
        )}
      />

      <Box toCenterY toCenterX>
        <Button
          type="submit"
          size={56}
          w-200
          roundedFull
          disabled={!isValid || loading}
        >
          {loading && <Spinner white></Spinner>}
          Confirm
        </Button>
      </Box>
    </Box>
  )
}
