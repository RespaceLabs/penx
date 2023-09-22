import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { useFocused, useSelected } from 'slate-react'
import { ElementProps } from '@penx/editor-types'
import { useEditorContext } from '../../components/EditorProvider'
// import { api } from '~/utils/api'
import { DocItem } from './DocItem'

export const DocListElement = ({ attributes, children }: ElementProps) => {
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const { pathname } = useRouter()
  const { isDesign } = useEditorContext()

  if (isDesign) {
    return (
      <Box
        {...attributes}
        cursorPointer
        bgGray100
        h-300
        toCenter
        border={active}
        borderBrand500={active}
      >
        <Box contentEditable={false}>Doc List</Box>
        {children}
      </Box>
    )
  }

  return (
    <Box {...attributes} flex-1>
      <DocList />
      {children}
    </Box>
  )
}

function DocList() {
  const { space } = useEditorContext()
  // const {
  //   isLoading,
  //   data = [],
  //   refetch,
  // } = api.doc.listBySpaceId.useQuery({ id: space?.id! })
  const data: any[] = []

  return (
    <Box contentEditable={false} mx-auto maxW-1000>
      {data?.map((item) => (
        <DocItem key={item.id} doc={item} />
      ))}
    </Box>
  )
}
