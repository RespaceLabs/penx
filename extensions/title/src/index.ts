import { ExtensionContext } from '@penx/extension-typings'
import { Title } from './Title'
import { ELEMENT_TITLE } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        type: ELEMENT_TITLE,
        component: Title,
        placeholder: 'Untitled',
      },
    ],
  })
}

export * from './types'
export * from './isTitle'

export { Title }
