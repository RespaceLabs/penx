import { atom, useAtom } from 'jotai'

import { hideThumbnail } from '../stores/thumbnail.store'

const appTypeAtom = atom<string>('')

export function useContentApp() {
  const [type, setType] = useAtom(appTypeAtom)
  function destroy() {
    setType('')
    hideThumbnail()
  }

  return { type, setType, destroy }
}
