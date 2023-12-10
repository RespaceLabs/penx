import styles from 'data-text:./components/content/content.module.scss'
import type { PlasmoCSConfig } from 'plasmo'

import { initFower } from './common/initFower'
import { ContentView } from './components/content/ContentView'

initFower()

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = styles

  return style
}

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
}

export default ContentView
