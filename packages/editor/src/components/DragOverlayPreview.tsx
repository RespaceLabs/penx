import { Box } from '@fower/react'

export function DragOverlayPreview() {
  return (
    <Box
      className="bullet"
      square-15
      bgTransparent
      bgGray200--hover
      bgGray200
      toCenter
      roundedFull
      ml--14
      mt-6
      cursorPointer
      flexShrink-1
    >
      <Box square-5 bgGray400 roundedFull transitionCommon scale-130 />
    </Box>
  )
}
