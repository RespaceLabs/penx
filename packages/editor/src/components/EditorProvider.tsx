import { createContext, PropsWithChildren, useContext } from 'react'
import { Space } from '@penx/model'

type Context = {
  space?: Space
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
