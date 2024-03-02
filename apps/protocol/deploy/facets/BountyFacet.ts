import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'BountyFacet',
  dependencyNames: ['INK'],
  libraryNames: ['Bounty', 'UuidCreator'],
  getDeployArgs({ dependencyContracts }) {
    return [dependencyContracts.INK.address]
  },
}

export default createDeployFunction(options)
