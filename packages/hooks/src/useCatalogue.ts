import { useMemo } from 'react'
import { Catalogue } from '@penx/domain'
import { useDocs } from './useDocs'
import { useSpaces } from './useSpaces'

export function useCatalogue() {
  const { activeSpace } = useSpaces()
  const { catalogueTree } = useDocs()

  return useMemo(
    () => new Catalogue(activeSpace, catalogueTree),
    [activeSpace, catalogueTree],
  )
}
