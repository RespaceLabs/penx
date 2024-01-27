import { defineConfig, loadEnv } from '@wagmi/cli'
import { react, actions, hardhat, etherscan } from '@wagmi/cli/plugins'

export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  })

  return {
    out: 'abi/generated.ts',
    contracts: [],
    plugins: [
      hardhat({
        project: './',
      }),
    ],
  }
})
