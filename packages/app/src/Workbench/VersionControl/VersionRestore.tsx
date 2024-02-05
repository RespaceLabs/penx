import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { CalendarDays } from 'lucide-react'
import { Spinner } from 'uikit'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { CommitListContainer } from './CommitListContainer'
import { SpacesSelect } from './SpacesSelect'

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick, ...rest },
  ref,
) {
  return (
    <Box
      ref={ref}
      gray500
      bgSlate100
      h-40
      rounded-8
      px3
      inlineFlex
      cursorPointer
      gap1
      toCenterY
      onClick={onClick}
    >
      <CalendarDays size={20} />
      <Box gray800>{rest.value}</Box>
    </Box>
  )
})

export function VersionRestore() {
  const [date, setDate] = useState(new Date())
  const { data } = useSession()
  const { data: token, isLoading } = trpc.github.getTokenByUserId.useQuery({
    userId: data.userId,
  })

  if (isLoading) {
    return (
      <Box>
        <Spinner></Spinner>
      </Box>
    )
  }

  if (!token) return null

  return (
    <Box column gap2>
      <Box heading2>Restore data from GitHub</Box>

      <Box toCenterY gap8>
        <Box toCenterY gap2>
          <Box>Select space:</Box>
          <Box w-200>
            <SpacesSelect />
          </Box>
        </Box>

        <Box toCenterY gap2>
          <Box>Select date:</Box>

          <DatePicker
            selected={date}
            onChange={(date) => {
              setDate(date!)
            }}
            customInput={<CustomInput />}
          />
        </Box>
      </Box>
      <CommitListContainer token={token} date={date} />
    </Box>
  )
}
