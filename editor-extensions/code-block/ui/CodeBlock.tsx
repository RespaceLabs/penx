import { ElementProps } from '@/lib/extension-typings'

import { CodeBlockElement } from '../types'
import { CodeBlockHeader } from './CodeBlockHeader'
import { CodeBlockProvider } from './CodeBlockProvider'

export const CodeBlock = ({
  attributes,
  children,
  element,
}: ElementProps<CodeBlockElement>) => {
  return (
    <CodeBlockProvider>
      <div
        className="bg-foreground/5 rounded leading-normal my-2 transition-all flex-1"
        {...attributes}
      >
        <CodeBlockHeader element={element} />
        <div className="pb-6 text-sm">{children}</div>
      </div>
    </CodeBlockProvider>
  )
}
