import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { Spinner } from 'uikit'
import { AppService } from '@penx/service'
import { appLoadingAtom, store } from '@penx/store'
import { useRunSSE } from './Workbench/hooks/useRunSSE'

export const appContext = createContext({} as { app: AppService })

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const loading = useAtomValue(appLoadingAtom)
  const appRef = useRef(new AppService())
  const { Provider } = appContext

  useRunSSE()

  useEffect(() => {
    if (!appRef.current.inited) {
      appRef.current.init()
    }
  }, [])

  if (loading) {
    return (
      <Box toCenter h-80vh>
        <Spinner />
      </Box>
    )
  }

  return <Provider value={{ app: appRef.current }}>{children}</Provider>
}
