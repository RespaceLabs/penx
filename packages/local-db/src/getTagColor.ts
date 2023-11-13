import { fowerStore } from '@fower/react'

export function getTagColor(): string {
  const { colors } = fowerStore.theme
  const keys = Object.keys(colors).filter(
    (i) =>
      i.endsWith('500') && !/gray|slate|zinc|neutral/i.test(i.toLowerCase()),
  )

  const index = Math.floor(Math.random() * keys.length)

  return keys[index]!
}
