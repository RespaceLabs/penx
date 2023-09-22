import { Catalogue } from '@penx/domain'
import { useSpaces } from './useSpaces'

export function useCatalogue() {
  const { catalogueTree, activeSpace } = useSpaces()
  return new Catalogue(activeSpace, catalogueTree)
}
