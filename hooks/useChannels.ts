import { RouterOutputs } from '@/server/_app'
import { atom, useAtom } from 'jotai'

export type Channel = RouterOutputs['channel']['listBySpaceId']['0']

export const channelsAtom = atom<Channel[]>([])

export function useChannels() {
  const [channels, setChannels] = useAtom(channelsAtom)
  return { channels, setChannels }
}
