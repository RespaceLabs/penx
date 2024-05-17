import { EventType, ListItem } from 'penx'
import clipboard from 'tauri-plugin-clipboard-api'
import { db } from '@penx/local-db'
import { useCommandAppUI } from './useCommandAppUI'
import { useCommandPosition } from './useCommandPosition'
import { useCurrentCommand } from './useCurrentCommand'
import { useItems } from './useItems'

export function useHandleSelect() {
  const { setItems } = useItems()
  const { setUI } = useCommandAppUI()
  const { setPosition } = useCommandPosition()
  const { setCurrentCommand } = useCurrentCommand()

  return async (item: ListItem, input = '') => {
    if (item.type === 'command') {
      // if (!q) setQ(item.title as string)

      setCurrentCommand(item)

      setPosition('COMMAND_APP')

      const ext = await db.getExtensionBySlug(item.data.extensionSlug)
      if (!ext) return

      const command = ext.commands.find(
        (c) => c.name === item.data.commandName,
      )!

      let worker: Worker
      if (command.isBuiltIn) {
        console.log('name........:', command)

        if (command.name === 'clipboard-history') {
          worker = new Worker(
            new URL('../workers/clipboard-history.ts', import.meta.url),
            { type: 'module' },
          )
        } else {
          worker = new Worker(
            new URL('../workers/marketplace.ts', import.meta.url),
            { type: 'module' },
          )
        }
      } else {
        // console.log('=========command?.code:, ', command?.code)

        let blob = new Blob([`self.input = '${input}'\n` + command?.code], {
          type: 'application/javascript',
        })
        const url = URL.createObjectURL(blob)
        worker = new Worker(url)
      }
      // worker.terminate()

      item.data.commandName && worker.postMessage(item.data.commandName)

      worker.onmessage = async (event: MessageEvent<any>) => {
        if (event.data?.type === EventType.RenderList) {
          const list: ListItem[] = event.data.items || []
          console.log('event--------:', event.data.items)

          const newItems = list.map<ListItem>((item) => ({
            type: 'list-item',
            ...item,
          }))

          setItems(newItems)

          setUI({
            type: 'list',
            items: newItems,
          })
        }

        if (event.data?.type === EventType.RenderMarkdown) {
          const content = event.data.content as string
          setUI({
            type: 'markdown',
            content,
          })
        }

        if (event.data?.type === 'marketplace') {
          setUI({ type: 'marketplace' })
        }
      }
    }

    if (item.type === 'list-item') {
      if (item.actions?.[0]) {
        const defaultAction = item.actions?.[0]
        if (defaultAction.type === 'OpenInBrowser') {
          // console.log('========defaultAction.url:', defaultAction.url)
          open(defaultAction.url)
        }

        if (defaultAction.type === 'CopyToClipboard') {
          await clipboard.writeText(defaultAction.content)
        }
      }
      console.log('list item:', item)
    }
  }
}
