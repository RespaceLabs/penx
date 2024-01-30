import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'VaultFacet',
  dependencyNames: ['DaoVault'],
  getDeployArgs({ dependencyContracts }) {
    return [dependencyContracts.DaoVault.address]
  },
}

export default createDeployFunction(options)
