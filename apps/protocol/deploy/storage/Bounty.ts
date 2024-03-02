import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'Bounty',
  libraryNames: ['UuidCreator'],
}

export default createDeployFunction(options)
