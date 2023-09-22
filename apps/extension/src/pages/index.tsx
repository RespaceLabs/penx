import { Box } from '@fower/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Main } from '~/components/main'

function IndexPage() {
  const { push } = useRouter()
  return (
    <Box>
      <Main name="App" />
      <Link href="/test">
        <Box>GOGO</Box>
      </Link>
    </Box>
  )
}

export default IndexPage
