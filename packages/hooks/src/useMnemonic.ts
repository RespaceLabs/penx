import { useAtomValue } from 'jotai'
import { mnemonicAtom } from '@penx/store'

export function useMnemonic() {
  const mnemonic = useAtomValue(mnemonicAtom)
  return { mnemonic }
}
