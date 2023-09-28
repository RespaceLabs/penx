import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { mergeRefs } from '@bone-ui/utils'
import { Box } from '@fower/react'
import { Node } from 'slate'
import { convertToValidHtmlId } from '@penx/catalogue'
import { ElementProps } from '@penx/plugin-typings'
import { getToc, mutateToc } from './useToc'

export const Heading = ({
  attributes,
  element,
  children,
  nodeProps,
  atomicProps,
}: ElementProps) => {
  const { type } = element

  const title = Node.string(element)
  const id = convertToValidHtmlId(title)

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  })

  useEffect(() => {
    const toc = getToc()
    if (!toc) return
    const find = toc.find((i) => i.id === id)
    if (find && find.inView !== inView) {
      mutateToc(id, inView)
    }
  }, [inView, id])

  return (
    <Box
      as={type.toLocaleLowerCase() as any}
      id={id}
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
      {...atomicProps}
      ref={mergeRefs([ref, attributes.ref])}
    >
      {children}
    </Box>
  )
}
