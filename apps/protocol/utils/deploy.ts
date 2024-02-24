import { ethers } from 'hardhat'
import {
  Address,
  DeployFunction,
  DeployOptionsBase,
  DeployResult,
  Deployment,
  DeploymentsExtension,
} from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

type LibraryName = 'PermissionFlag' | 'LibDiamond' | 'TransferUtils' | 'RoleAccessControl'

type ContractName =
  | LibraryName
  | 'Diamond'
  | 'DiamondInit'
  | 'Multicall3'
  | 'DiamondCutFacet'
  | 'DiamondLoupeFacet'
  | 'BelieverFacet'
  | 'Believer'
  | 'INK'
  | 'PointFacet'
  | 'DaoVault'
  | 'BountyFacet'
  | 'VaultFacet'
  | 'RoleAccessControlFacet'

type DependencyContracts = Record<ContractName, Deployment>

type AfterDeployArgs = {
  deployedContract: DeployResult
  deployer: string
  getNamedAccounts: () => Promise<Record<string, string>>
  deployments: DeploymentsExtension
}

type GetDeployArgs = ({
  dependencyContracts,
}: {
  dependencyContracts: DependencyContracts
}) => Promise<DeployOptionsBase['args']> | DeployOptionsBase['args']

export type DeployFunctionOptions = {
  contractName: ContractName
  dependencyNames?: ContractName[]
  getDeployArgs?: GetDeployArgs
  libraryNames?: LibraryName[]
  id?: string
  afterDeploy?: (args: AfterDeployArgs) => Promise<void>
}

export function createDeployFunction(options: DeployFunctionOptions) {
  const { contractName, dependencyNames, getDeployArgs, libraryNames, afterDeploy } = options

  const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, get } = deployments
    const { deployer } = await getNamedAccounts()
    const libraries = await getLibraries(hre.deployments, libraryNames)
    const args = await getArgs(hre.deployments, options)

    let deployedContract

    try {
      deployedContract = await deploy(contractName, {
        from: deployer,
        log: true,
        args: args,
        libraries,
      })
    } catch (e) {
      // console.error("Deploy error", e);

      // the caught error might not be very informative
      // e.g. if some library dependency is missing, which library it is
      // is not shown in the error
      // attempt a deploy using hardhat so that a more detailed error
      // would be thrown
      await deployContract(contractName, args, {
        libraries,
      })

      // throw an error even if the hardhat deploy works
      // because the actual deploy did not succeed
      throw new Error(`Deploy failed with error ${e}`)
    }

    if (afterDeploy) {
      await afterDeploy({ deployedContract, deployer, getNamedAccounts, deployments })
    }
  }

  func.id = options.id || contractName // id required to prevent reexecution
  func.tags = [contractName]
  func.dependencies = getDependencies(options)

  return func
}

async function getArgs(deployments: DeploymentsExtension, options: DeployFunctionOptions) {
  const { dependencyNames = [], getDeployArgs } = options
  const dependencyContracts = {} as DependencyContracts

  if (dependencyNames) {
    for (let i = 0; i < dependencyNames.length; i++) {}
  }

  for (const dependencyName of dependencyNames) {
    dependencyContracts[dependencyName] = await deployments.get(dependencyName)
  }

  let args: DeployOptionsBase['args'] = []

  if (getDeployArgs) {
    args = (await getDeployArgs({ dependencyContracts }))!
  }
  return args
}

async function getLibraries(deployments: DeploymentsExtension, libraryNames: string[] = []) {
  const libraries: Record<string, Address> = {}

  for (const libraryName of libraryNames) {
    libraries[libraryName] = (await deployments.get(libraryName)).address
  }

  return libraries
}

function getDependencies(options: DeployFunctionOptions) {
  const { dependencyNames = [], libraryNames = [] } = options
  return [...dependencyNames, ...libraryNames]
}

async function deployContract(name: string, args: any, contractOptions = {}) {
  const contractFactory = await ethers.getContractFactory(name, contractOptions)
  return contractFactory.deploy(...args)
}
