import { Box } from '@fower/react'
import { Logo } from './Logo'

export function LogoSpinner() {
  return (
    <Box column toCenter>
      <Logo></Logo>
      <Box className="logo-loader"></Box>
    </Box>
  )
}
