import { MoonOutline, SunOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { useMode } from './useMode'

export const ModeToggle = () => {
  const { mode, setMode } = useMode()

  function toggleMode() {
    if (mode === 'dark') {
      setMode('light')
    } else {
      setMode('dark')
    }
  }

  return (
    <Box
      flexShrink-0
      onClick={toggleMode}
      roundedFull
      bgGray200--hover
      square7
      cursorPointer
      toCenter
    >
      {mode === 'dark' && <MoonOutline square5 white--dark />}
      {mode !== 'dark' && <SunOutline square5 gray600 />}
    </Box>
  )
}
