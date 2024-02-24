import { HardhatRuntimeEnvironment } from 'hardhat/types'

export type RolesConfig = {
  account: string
  roles: string[]
}[]

export const getRoles = async (hre: HardhatRuntimeEnvironment): Promise<RolesConfig> => {
  const { deployer, keeper } = await hre.getNamedAccounts()

  const [account0, account1, account2, account3, account4] = await hre.getUnnamedAccounts()

  console.log('===========deployer:', deployer, 'account1:', account1, 'keeper:', keeper)

  const config: Record<string, RolesConfig> = {
    hardhat: [
      {
        account: deployer,
        roles: ['CONFIG', 'KEEPER'],
      },
      {
        account: account0,
        roles: ['CONFIG', 'KEEPER'],
      },
    ],
    sepolia: [
      {
        account: deployer,
        roles: ['CONFIG', 'KEEPER'],
      },
      {
        account: account0,
        roles: ['CONFIG', 'KEEPER'],
      },
    ],
  }

  return config[hre.network.name]
}
