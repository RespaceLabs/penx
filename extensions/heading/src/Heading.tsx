import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { HeadingElement } from './types'

export const Heading = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<HeadingElement>) => {
  const { type } = element

  return (
    <Box
      as={type.toLocaleLowerCase() as any}
      leadingLoose
      text3XL={type === 'h1'}
      text2XL={type === 'h2'}
      textXL={type === 'h3'}
      textLG={type === 'h4'}
      textBase={type === 'h5'}
      textSM={type === 'h6'}
      relative
      mt0
      mb0
      {...attributes}
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
