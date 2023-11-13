import { createContext, PropsWithChildren, useContext } from 'react'
import { ISpace } from '@penx/model-types'

type Context = {
  doc?: any
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
