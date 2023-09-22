import { useMemo } from 'react'
import { ChevronLeftOutline, ChevronRightOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { CatalogueTree } from '@penx/catalogue'
import { ElementProps, PreviousNextElement } from '@penx/editor-types'
import { useEditorContext } from '../../components/EditorProvider'

export const PreviousNext = ({
  attributes,
  element,
  children,
  nodeProps,
  atomicProps,
}: ElementProps<PreviousNextElement>) => {
  const { query, push } = useRouter()
  const slug = query.slug as string
  const { space } = useEditorContext()

  const tree = useMemo(() => {
    const nodes = JSON.parse(space?.catalogue ?? '[]')
    return new CatalogueTree(nodes)
  }, [space?.catalogue])

  const { prev, next } = tree.getSiblings(slug)
  return (
    <Box toBetween p10 {...attributes} {...nodeProps} {...atomicProps}>
      {children}
      <Box contentEditable={false}>
        {prev && (
          <Box
            as="a"
            pl4
            pr6
            py5
            rounded2XL
            toCenterY
            gap2
            gray500
            textSM
            bgGray100--hover
            onClick={(e) => {
              e.preventDefault()
              push(`/${prev.id}`)
            }}
          >
            <ChevronLeftOutline size={24} />
            <Box column gap2>
              <Box textXS>Previous</Box>
              <Box brand500 textLG>
                {prev.name}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Box contentEditable={false}>
        {next && (
          <Box
            as="a"
            pl4
            pr6
            py5
            rounded2XL
            toCenterY
            gap2
            gray500
            textSM
            bgGray100--hover
            onClick={(e) => {
              e.preventDefault()
              push(`/${next.id}`)
            }}
          >
            <Box column toRight gap2>
              <Box textXS>Next</Box>
              <Box brand500 textLG>
                {next.name}
              </Box>
            </Box>
            <ChevronRightOutline size={24} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
