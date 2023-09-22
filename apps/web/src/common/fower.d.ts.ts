import {
  composeAtom,
  injectGlobalStyle,
  setConfig,
  setTheme,
} from '@fower/react'

declare module '@fower/atomic-props' {
  export interface AtomicProps {
    heading1?: boolean
    heading2?: boolean

    shadowPopover?: boolean
  }
}
