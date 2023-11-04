import { useSortable } from '@dnd-kit/sortable'
import { getState, mutate, useStore } from 'stook'

export const rowSortableKey = 'rowSortable-'

type State = ReturnType<typeof useSortable>

export function useRowSortable(id = '') {
  const [rowSortable] = useStore<State>(rowSortableKey + id)

  return { rowSortable }
}
