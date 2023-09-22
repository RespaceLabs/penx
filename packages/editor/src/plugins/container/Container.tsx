import { Box } from '@fower/react'
import { ContainerElement, ElementProps } from '@penx/editor-types'

export const Container = ({
  attributes,
  element,
  children,
  nodeProps,
  atomicProps,
}: ElementProps<ContainerElement>) => {
  return (
    <Box column w-100p relative minH-100px m0 {...attributes} {...nodeProps}>
      <Box w={['100%', '100%', element.width]} mx-auto {...atomicProps}>
        {children}
      </Box>
    </Box>
  )
}
