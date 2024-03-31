import { PropsWithChildren } from 'react'

export const ExtensionLoadingProvider = ({ children }: PropsWithChildren) => {
  console.log('loading..............')
  return <>{children}</>
}
