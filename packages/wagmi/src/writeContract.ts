import { writeContract as writeContractRaw } from '@wagmi/core'
import {
  Abi,
  ContractFunctionArgs,
  ContractFunctionName,
  WriteContractParameters,
  WriteContractReturnType,
} from 'viem'
import { wagmiConfig } from './config'

export function writeContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
>(
  parameters: WriteContractParameters<abi, functionName, args, any, any>,
): Promise<WriteContractReturnType> {
  return writeContractRaw(wagmiConfig as any, parameters as any)
}
