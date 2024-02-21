import React from 'react'
import { Box } from '@fower/react'
import { Logo } from '../Logo'
import { SocialNav } from '../SocialNav'
import { HowToGet } from './HowToGet'
import { Main } from './Main'
import { WalletProfile } from './WalletProfile'

export function Home() {
  return (
    <Box h-100vh column>
      <Box toBetween p4>
        <Logo size={28}></Logo>
        <SocialNav />
      </Box>

      <Box column flex-1 p6 toCenter gap4>
        <Main></Main>
        <HowToGet />
      </Box>
    </Box>
  )
}
