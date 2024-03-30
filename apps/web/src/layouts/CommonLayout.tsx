import { FC, PropsWithChildren } from 'react'
import { ToastContainer } from 'uikit'
import { TrpcProvider } from '@penx/trpc-client'
import { EventHandler } from '~/components/EventHandler'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

export const CommonLayout: FC<PropsWithChildren> = ({ children }) => {
  const shared = (
    <TrpcProvider>
      <EventHandler />
      {children}
      <ToastContainer position="bottom-right" />
    </TrpcProvider>
  )

  if (!navigator.onLine) {
    return <>{shared}</>
  }

  return <WalletConnectProvider>{shared}</WalletConnectProvider>
}
