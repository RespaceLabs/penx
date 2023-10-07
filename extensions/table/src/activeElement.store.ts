import { getState, useStore } from 'stook'

const key = 'active-element'

export function useActiveElement(id = '') {
  const [activeId, setActiveId] = useStore<string | null>(key + id, null)
  return { activeId, setActiveId }
}

export function getActiveRow(id = ''): boolean {
  return getState(key + id)
}
