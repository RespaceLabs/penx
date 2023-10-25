import { Space } from '@penx/model'
import { SpaceService } from '@penx/service'
import { useSpaces } from './useSpaces'

export function useSpaceService() {
  const { activeSpace } = useSpaces()
  return new SpaceService(new Space(activeSpace))
}
