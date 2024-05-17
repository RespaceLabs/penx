import { atom, useAtom } from 'jotai'
import { ListItem } from 'penx'

type MarketplaceUI = {
  type: 'marketplace'
}

type LoadingUI = {
  type: 'loading'
}

type MarkdownUI = {
  type: 'markdown'
  content: string
}

type ListUI = {
  type: 'list'
  items: ListItem[]
}

type CommandAppUI = ListUI | MarkdownUI | LoadingUI | MarketplaceUI

export const uiAtom = atom<CommandAppUI>({} as CommandAppUI)

export function useCommandAppUI() {
  const [ui, setUI] = useAtom(uiAtom)
  return { ui, setUI }
}
