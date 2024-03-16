import { atom, useAtom } from 'jotai'

export enum TodoFilterType {
  TODAY,
  SEVEN_DAY,
  ALL_TODOS,
}

export const todoFilterAtom = atom<TodoFilterType>(TodoFilterType.TODAY)

export function useTodoFilter() {
  const [filter, setFilter] = useAtom(todoFilterAtom)
  return {
    filter,
    isTody: TodoFilterType.TODAY === filter,
    isSevenDay: TodoFilterType.SEVEN_DAY === filter,
    isAllTodos: TodoFilterType.ALL_TODOS === filter,
    setFilter,
  }
}
