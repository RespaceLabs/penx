import React, { useMemo, type ReactNode } from 'react'
import useSession from '@/lib/useSession'
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit'
import type { Address } from 'viem'
import { createSiweMessage, type SiweMessage } from 'viem/siwe'

type UnconfigurableMessageOptions = {
  address: Address
  chainId: number
  nonce: string
}

type ConfigurableMessageOptions = Partial<
  Omit<SiweMessage, keyof UnconfigurableMessageOptions>
> & {
  [_Key in keyof UnconfigurableMessageOptions]?: never
}

export type GetSiweMessageOptions = () => ConfigurableMessageOptions

interface RainbowKitSiweNextAuthProviderProps {
  enabled?: boolean
  getSiweMessageOptions?: GetSiweMessageOptions
  children: ReactNode
}

export function RainbowKitSiweProvider({
  children,
  enabled,
  getSiweMessageOptions,
}: RainbowKitSiweNextAuthProviderProps) {
  const { status } = useSession()
  const adapter = useMemo(
    () =>
      createAuthenticationAdapter({
        createMessage: ({ address, chainId, nonce }) => {
          const defaultConfigurableOptions: Required<
            Pick<
              ConfigurableMessageOptions,
              'domain' | 'uri' | 'version' | 'statement'
            >
          > = {
            domain: window.location.host,
            statement: 'Sign in with Ethereum to the app.',
            uri: window.location.origin,
            version: '1',
          }

          const unconfigurableOptions: UnconfigurableMessageOptions = {
            address,
            chainId,
            nonce,
          }

          return createSiweMessage({
            ...defaultConfigurableOptions,

            // Spread custom SIWE message options provided by the consumer
            ...getSiweMessageOptions?.(),

            // Spread unconfigurable options last so they can't be overridden
            ...unconfigurableOptions,
          })
        },

        getNonce: async () => {
          const response = await fetch('/api/nonce')
          return await response.text()
        },

        signOut: async () => {
          await fetch('/api/session', { method: 'DELETE' }).then((r) =>
            r.json(),
          )
        },

        verify: async ({ message, signature }) => {
          console.log('======= message, signature :', message, signature)
          const verifyRes = await fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'wallet',
              message,
              signature,
            }),
          })

          location.href = '/'
          return Boolean(verifyRes.ok)
        },
      }),
    [getSiweMessageOptions],
  )

  return (
    <RainbowKitAuthenticationProvider
      adapter={adapter}
      enabled={enabled}
      status={status}
    >
      {children}
    </RainbowKitAuthenticationProvider>
  )
}
