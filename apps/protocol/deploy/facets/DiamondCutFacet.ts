import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'DiamondCutFacet',
  libraryNames: ['LibDiamond'],
}

export default createDeployFunction(options)
