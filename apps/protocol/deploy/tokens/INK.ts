import { DeployFunctionOptions, createDeployFunction } from '../../utils/deploy'

export const options: DeployFunctionOptions = {
  contractName: 'INK',
  getDeployArgs({ namedAccounts }) {
    return [namedAccounts.deployer]
  },
}

export default createDeployFunction(options)
