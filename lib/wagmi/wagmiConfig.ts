import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, baseSepolia } from '@reown/appkit/networks'
import { cookieStorage, createStorage, http } from '@wagmi/core'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
