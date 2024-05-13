import { useEffect } from 'react'
import { Item } from '@penxio/extension-api'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'

export const itemsAtom = atom<Item[]>([])

export function useItems() {
  const [items, setItems] = useAtom(itemsAtom)
  return { items, setItems }
}

export const commandsAtom = atom<Item[]>([])

export function useCommands() {
  const [commands, setCommands] = useAtom(itemsAtom)
  return { commands, setCommands }
}

export function useQueryCommands() {
  const setItems = useSetAtom(itemsAtom)
  const setCommands = useSetAtom(commandsAtom)

  const { data } = useQuery(['commands'], async () => {
    const extensions = await db.listExtensions()
    return extensions.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.commands.map<Item>((item) => ({
          type: 'command',
          title: item.title,
          data: {
            commandName: item.name,
            extensionSlug: cur.slug,
          },
        })),
      ],
      [] as Item[],
    )
  })

  useEffect(() => {
    if (data?.length) {
      setItems(data)
      setCommands(data)
    }
  }, [data, setItems, setCommands])
}
