import { fowerStore } from '@fower/react'

export function getRandomColor(postfix = '500'): string {
  const { colors } = fowerStore.theme
  const keys = Object.keys(colors).filter(
    (i) =>
      i.endsWith(postfix) &&
      !/gray|slate|zinc|neutral|stone/i.test(i.toLowerCase()),
  )

  const index = Math.floor(Math.random() * keys.length)

  return keys[index]!
}
