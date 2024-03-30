import { FC, PropsWithChildren } from 'react'
import { ToastContainer } from 'uikit'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'
import { EventHandler } from '~/components/EventHandler'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

export const CommonLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClientOnly>
      <WalletConnectProvider>
        <TrpcProvider>
          <EventHandler />
          {children}
          <ToastContainer position="bottom-right" />
        </TrpcProvider>
      </WalletConnectProvider>
    </ClientOnly>
  )
}
