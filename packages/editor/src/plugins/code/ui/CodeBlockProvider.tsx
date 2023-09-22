import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export enum CodeBlockStatus {
  NORMAL,
  HIGHLIGHT_SETTING,
}

export interface CodeBlockContext {
  status: CodeBlockStatus
  setStatus: Dispatch<SetStateAction<CodeBlockStatus>>
}

export const codeBlockContext = createContext<CodeBlockContext>(
  {} as CodeBlockContext,
)

interface Props {
  children: React.ReactNode
}
export const CodeBlockProvider = (props: Props) => {
  const { Provider } = codeBlockContext
  const [status, setStatus] = useState(CodeBlockStatus.NORMAL)

  return <Provider value={{ status, setStatus }}>{props.children}</Provider>
}

export function useCodeBlockContext() {
  return useContext(codeBlockContext)
}
