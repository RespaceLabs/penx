import { atom, useAtom } from 'jotai'

export enum TaskStatus {
  ALL = 'All',
  AVAILABLE = 'Available',
  COMPLETED = 'Completed',
}

const filterAtom = atom(TaskStatus.AVAILABLE)

export function useTaskFilter() {
  const [filter, setFilter] = useAtom(filterAtom)
  return { filter, setFilter }
}
