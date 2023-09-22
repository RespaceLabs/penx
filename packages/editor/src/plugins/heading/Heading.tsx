import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { mergeRefs } from '@bone-ui/utils'
import { Box } from '@fower/react'
import { Node } from 'slate'
import { convertToValidHtmlId } from '@penx/catalogue'
import { ElementType } from '@penx/editor-shared'
import { ElementProps } from '@penx/editor-types'
import { getToc, mutateToc } from '../../hooks/useToc'

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
      text3XL={type === ElementType.h1}
      text2XL={type === ElementType.h2}
      textXL={type === ElementType.h3}
      textLG={type === ElementType.h4}
      textBase={type === ElementType.h5}
      textSM={type === ElementType.h6}
      relative
      mt0
      mb0
      // mt8={type === ElementType.h1}
      // mt6={type === ElementType.h2}
      // mt4={type === ElementType.h3}
      // mt3={type === ElementType.h4}
      // mt2={type === ElementType.h5}
      // mt1={type === ElementType.h6}
      {...attributes}
      {...nodeProps}
      {...atomicProps}
      ref={mergeRefs([ref, attributes.ref])}
    >
      {children}
    </Box>
  )
}
