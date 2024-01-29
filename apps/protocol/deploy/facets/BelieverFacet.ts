import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'BelieverFacet',
  dependencyNames: ['Believer', 'DaoVault'],
  getDeployArgs({ dependencyContracts }) {
    return [dependencyContracts.Believer.address, dependencyContracts.DaoVault.address]
  },
}

export default createDeployFunction(options)
