import { Tag } from '@bone-ui/tag'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { Element, Node } from 'slate'
import { RouterOutputs } from '~/utils/api'

const serialize = (nodes: Element[]) => {
  return nodes.map((n) => Node.string(n)).join('\n')
}

export function DocItem(props: { doc: RouterOutputs['doc']['all'][number] }) {
  const { doc } = props
  const content = serialize(JSON.parse(doc.content))
  const { id } = doc
  const { push } = useRouter()

  return (
    <Box toCenterY toBetween py2>
      <Box column gap1 flex-1>
        <Box
          as="a"
          href={`/${id}`}
          target="_blank"
          text2XL
          fontSemibold
          gray900
          black--hover
          onClick={(e) => {
            e.preventDefault()
            push(`/${id}`)
          }}
        >
          {doc.title || 'Untitled'}
        </Box>
        <Box gray500 w-80p leadingNormal>
          {content.slice(0, 160) || '...'}
        </Box>
        <Box mt4 toCenterY gapX3>
          <Tag textXS colorScheme="gray400" variant="light" gray800>
            JavaScript
          </Tag>

          <Box size="md" textXS>
            {doc.updatedAt.toDateString()}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
