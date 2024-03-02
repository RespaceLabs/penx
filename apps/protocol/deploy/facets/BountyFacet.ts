import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'BountyFacet',
  dependencyNames: ['INK'],
  getDeployArgs({ dependencyContracts }) {
    return [dependencyContracts.INK.address]
  },
}

export default createDeployFunction(options)
