import { HardhatRuntimeEnvironment } from 'hardhat/types'
// 0x525E71FE479c4244026d8B998d35b5BD2F256Ca7

export type RolesConfig = {
  account: string
  roles: string[]
}[]

export const getRoles = async (hre: HardhatRuntimeEnvironment): Promise<RolesConfig> => {
  const { deployer, keeper } = await hre.getNamedAccounts()

  const [account0, account1, account2, account3, account4] = await hre.getUnnamedAccounts()

  // console.log(
  //   '===========deployer:',
  //   deployer,
  //   'account1:',
  //   account1,
  //   'keeper:',
  //   keeper,
  //   'hre.network.name:',
  //   hre.network.name,
  // )

  const config: Record<string, RolesConfig> = {
    hardhat: [
      {
        account: deployer,
        roles: ['ADMIN', 'CONFIG', 'KEEPER'],
      },
      {
        account: keeper,
        roles: ['KEEPER'],
      },
    ],
    sepolia: [
      {
        account: deployer,
        roles: ['ADMIN', 'CONFIG', 'KEEPER'],
      },
      {
        account: keeper,
        roles: ['KEEPER'],
      },
    ],
  }

  return config[hre.network.name]
}
