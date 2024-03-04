import { DeployFunctionOptions, createDeployFunction } from '../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'PasswordManager',
}

export default createDeployFunction(options)
