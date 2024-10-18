import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, baseSepolia } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from '@wagmi/core'
import { PROJECT_ID } from '../constants'

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: PROJECT_ID,
  networks,
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
