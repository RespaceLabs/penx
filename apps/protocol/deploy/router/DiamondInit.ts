import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'DiamondInit',
  libraryNames: ['LibDiamond'],
}

export default createDeployFunction(options)
