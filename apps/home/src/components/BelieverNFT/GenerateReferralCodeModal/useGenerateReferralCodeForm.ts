import { SubmitHandler, useForm } from 'react-hook-form'
import { readContract } from '@wagmi/core'
import { zeroAddress } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'
import { modalController, toast, useModalContext } from 'uikit'
import { believerNftAbi } from '@penx/abi'
import { ModalNames } from '@penx/constants'
import { sleep } from '@penx/shared'
import { addressMap, client, wagmiConfig } from '@penx/wagmi'

export type CreateSpaceValues = {
  code: string
}

export function useGenerateReferralCodeForm() {
  const ctx = useModalContext<boolean>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      code: '',
    },
  })

  const { refetch, data } = useReadContract({})

  console.log('=========data:', data, data === zeroAddress)

  const { writeContractAsync } = useWriteContract()

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (values) => {
    ctx?.setData?.(true)

    try {
      const referrer = await readContract(wagmiConfig, {
        address: addressMap.BelieverNFT,
        abi: believerNftAbi,
        functionName: 'getReferrer',
        args: [values.code],
      })

      if (referrer !== zeroAddress) {
        toast.success('This code is already used by someone else')
        ctx?.setData?.(false)
        return
      }

      await writeContractAsync({
        address: addressMap.BelieverNFT,
        abi: believerNftAbi,
        functionName: 'setReferralCode',
        args: [values.code],
      })
      await sleep(2000)
      toast.success('Mint Believer NFT successfully!')
      ctx.close()
      modalController.open(ModalNames.MY_REFERRALS)
    } catch (error: any) {
      toast.info(error.shortMessage || error.message)
    }

    ctx?.setData?.(false)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
