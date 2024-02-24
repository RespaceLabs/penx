import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'RoleAccessControl',
}

export default createDeployFunction(options)
