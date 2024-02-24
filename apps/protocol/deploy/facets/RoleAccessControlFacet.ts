import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'RoleAccessControlFacet',
  dependencyNames: ['RoleAccessControl'],
}

export default createDeployFunction(options)
