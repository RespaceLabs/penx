import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'Diamond',
  dependencyNames: ['DiamondCutFacet', 'DiamondLoupeFacet', 'DiamondInit'],
  libraryNames: ['LibDiamond'],
  getDeployArgs: async ({ dependencyContracts }) => {
    const { deployer } = await getNamedAccounts()
    return [
      dependencyContracts.DiamondCutFacet.address,
      dependencyContracts.DiamondLoupeFacet.address,
      dependencyContracts.DiamondInit.address,
      deployer,
    ]
  },
}

export default createDeployFunction(options)
