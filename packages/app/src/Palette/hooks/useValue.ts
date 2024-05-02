import { atom, useAtom } from 'jotai'

const valueAtom = atom('')
export function useValue() {
  const [value, setValue] = useAtom(valueAtom)
  return { value, setValue }
}
