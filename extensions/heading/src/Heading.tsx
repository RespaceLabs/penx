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
      leadingTight
      text-24={type === 'h1'}
      text-21={type === 'h2'}
      text-19={type === 'h3'}
      text-17={type === 'h4'}
      textBase={type === 'h5'}
      mt="1em"
      mb="0.5em"
      relative
      // style={{
      //   verticalAlign: 'center',
      // }}
      // mt0
      // mb0
      {...attributes}
      {...nodeProps}
    >
      {children}
    </Box>
  )
}
