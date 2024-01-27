import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'DiamondLoupeFacet',
  libraryNames: ['LibDiamond'],
}

export default createDeployFunction(options)
