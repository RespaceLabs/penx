import { atom, useAtom } from 'jotai'

export const appLoading = atom<boolean>(true)
export function useAppLoading() {
  const [loading, setLoading] = useAtom(appLoading)
  return { loading, setLoading }
}
