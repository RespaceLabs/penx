import { FowerHTMLProps, styled } from '@fower/react'
import { Command } from '@penx/cmdk'

const StyledCommandList = styled(Command.List)

interface Props extends FowerHTMLProps<'div'> {
  isMobile?: boolean
}

export function ContentWrapper({ children, ...rest }: Props) {
  return (
    <StyledCommandList
      h-460
      px2
      py2
      overflowAuto
      css={{
        transition: '100ms ease',
        transitionProperty: 'height',
        scrollPaddingBlockEnd: 40,
        overscrollBehavior: 'contain',
      }}
      {...rest}
    >
      {children}
    </StyledCommandList>
  )
}
