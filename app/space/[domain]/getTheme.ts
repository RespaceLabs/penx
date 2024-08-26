import { themes } from './themes'

export function getTheme(themeName: string) {
  return themes[themeName] || themes.card
}
