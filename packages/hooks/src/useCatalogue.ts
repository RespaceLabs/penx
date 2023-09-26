import { useMemo } from 'react'
import { Catalogue } from '@penx/domain'
import { useSpaces } from './useSpaces'

export function useCatalogue() {
  const { catalogueTree, activeSpace } = useSpaces()
  return useMemo(
    () => new Catalogue(activeSpace, catalogueTree),
    [activeSpace, catalogueTree],
  )
}
