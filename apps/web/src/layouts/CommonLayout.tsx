import { FC, PropsWithChildren } from 'react'
import { useSession } from 'next-auth/react'
import { ToastContainer } from 'uikit'
import { StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import { EventHandler } from '~/components/EventHandler'
import { InitUserToStore } from '~/components/InitUserToStore'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

export const CommonLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession()
  const shared = (
    <TrpcProvider>
      <EventHandler />

      {navigator.onLine && status === 'authenticated' && (
        <InitUserToStore userId={session.userId} />
      )}
      {children}
      <ToastContainer position="bottom-right" />
    </TrpcProvider>
  )

  if (!navigator.onLine) {
    return <>{shared}</>
  }

  return (
    <StoreProvider>
      <WalletConnectProvider>{shared}</WalletConnectProvider>
    </StoreProvider>
  )
}
