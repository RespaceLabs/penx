import { getState, mutate, useStore } from 'stook'

const key = 'link-popover'

export function useLinkIsOpen(id = '') {
  const [isOpen, setOpen] = useStore<boolean>(key + id, false)
  function close() {
    setOpen(false)
  }

  return { isOpen, setOpen, close }
}

export function openLink(id = '') {
  return mutate(key + id, true)
}

export function closeLink(id = '') {
  return mutate(key + id, false)
}

export function getLinkIsOpen(id = ''): boolean {
  return getState(key + id)
}
