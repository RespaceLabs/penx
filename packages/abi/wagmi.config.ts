import { defineConfig, loadEnv } from '@wagmi/cli'
import { actions, etherscan, hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig(() => {
  return {
    out: 'src/generated.ts',
    contracts: [],
    plugins: [
      hardhat({
        project: '../../apps/protocol',
      }),
    ],
  }
})
