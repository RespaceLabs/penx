import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'PointFacet',
}

export default createDeployFunction(options)
