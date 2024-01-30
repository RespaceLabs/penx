import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'TaskFacet',
  dependencyNames: ['PenxPoint'],
  getDeployArgs({ dependencyContracts }) {
    return [dependencyContracts.PenxPoint.address]
  },
}

export default createDeployFunction(options)
