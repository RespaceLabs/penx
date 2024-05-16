import { atom, useAtom } from 'jotai'
import { ListItem } from 'penx'

export const currentCommandAtom = atom<ListItem>(null as any as ListItem)

export function useCurrentCommand() {
  const [currentCommand, setCurrentCommand] = useAtom(currentCommandAtom)
  return { currentCommand, setCurrentCommand }
}
