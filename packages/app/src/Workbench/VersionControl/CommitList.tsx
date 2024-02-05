import { forwardRef, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Octokit } from 'octokit'
import { useUser } from '@penx/hooks'

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick },
  ref,
) {
  return (
    <Box ref={ref} gray500 inlineFlex cursorPointer ml2 onClick={onClick}>
      <CalendarDays size={20} />
    </Box>
  )
})

interface CommitListProps {
  token: string
}

export function CommitList({ token }: CommitListProps) {
  const [date, setDate] = useState(new Date())
  const user = useUser()
  // console.log('========date:', date, startOfDay(date))

  const octoRef = useRef(new Octokit({ auth: token }))

  const { data } = useQuery(['commits', token, date.toISOString()], () =>
    octoRef.current.request('GET /repos/{owner}/{repo}/commits', {
      owner: user.repoOwner,
      repo: user.repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
      since: startOfDay(date).toISOString(),
      until: endOfDay(date).toISOString(),
    }),
  )

  console.log('=========data:', data?.data)

  return (
    <Box>
      <DatePicker
        selected={date}
        onChange={(date) => {
          console.log('date=========:', date)
          setDate(date!)
        }}
        // customInput={<CustomInput />}
      />
      <Box>GOGO: {token}</Box>
      {data && (
        <Box>
          <Box></Box>
          {data.data.map((commit) => (
            <Box key={commit.sha}>
              <Box>{commit.commit.message}</Box>
              <Box>{commit.sha}</Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
