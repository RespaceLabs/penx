import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { precision } from '@utils/precision'
import { tokens } from '../config/tokens'

const func: DeployFunction = async ({ getNamedAccounts, deployments, network }) => {
  if (network.name != 'localhost' && network.name != 'hardhat') {
    return
  }
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  for (const { name, decimals } of tokens) {
    if (network.live) {
      console.warn('WARN: Deploying token on live network')
    }

    const existingToken = await deployments.getOrNull(name)

    if (existingToken) {
      log(`Reusing ${name} at ${existingToken.address}`)
      console.warn(`WARN: bytecode diff is not checked`)
      continue
    }

    const { address, newlyDeployed } = await deploy(name, {
      from: deployer,
      log: true,
      contract: 'MockToken',
      args: [name, decimals],
    })

    console.log('token:', name, address)

    if (newlyDeployed) {
      const tokenContract = await ethers.getContractAt('MockToken', address)
      await tokenContract.mint(deployer, precision.pow(10_000_000_000, decimals))
    }
  }
}

func.id = 'Tokens'
func.tags = ['Tokens']
func.dependencies = ['MockToken']
export default func
