import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async ({ getNamedAccounts, deployments, network }) => {
  if (!['localhost', 'hardhat'].includes(network.name)) {
    return
  }

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const { address, newlyDeployed } = await deploy('Multicall3', {
    from: deployer,
    log: true,
    args: [],
  })
}

func.id = 'Multicall3'
func.tags = ['Multicall3']
export default func
