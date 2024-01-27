import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'BelieverFacet',
  dependencyNames: ['Believer'],
  getDeployArgs({ dependencyContracts }) {
    return [dependencyContracts.Believer.address]
  },
}

export default createDeployFunction(options)
