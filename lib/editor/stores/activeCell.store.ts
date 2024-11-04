import { getState, useStore } from 'stook'

const key = 'active-cell'

export function useActiveCell(id = '') {
  const [activeId, setActiveId] = useStore<string | null>(key + id, null)
  return { activeId, setActiveId }
}

export function getActiveCell(id = ''): boolean {
  return getState(key + id)
}
