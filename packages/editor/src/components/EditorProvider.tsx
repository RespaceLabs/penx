import { createContext, PropsWithChildren, useContext } from 'react'
import { IDoc, ISpace } from '@penx/types'

type Context = {
  doc?: IDoc
  space?: ISpace
}

export const editorContext = createContext({} as Context)

export function useEditorContext() {
  return useContext(editorContext)
}

export const EditorProvider = ({
  children,
  ...ctx
}: PropsWithChildren<Context>) => {
  const { Provider } = editorContext

  return (
    <Provider
      value={{
        ...ctx,
      }}
    >
      {children}
    </Provider>
  )
}
