import { atom, useAtom } from 'jotai'
import { RouterOutputs } from '@penx/api'

// type Extension = RouterOutputs['extension']['all']['0']
type Extension = any

export const extensionAtom = atom<Extension>({} as Extension)

export function useExtension() {
  const [extension, setExtension] = useAtom(extensionAtom)
  return { extension, setExtension }
}
