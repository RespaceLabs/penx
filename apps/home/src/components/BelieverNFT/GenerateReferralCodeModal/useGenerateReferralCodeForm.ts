import { SubmitHandler, useForm } from 'react-hook-form'
import { readContract } from '@wagmi/core'
import { zeroAddress } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'
import { modalController, toast, useModalContext } from 'uikit'
import { believerNftAbi } from '@penx/abi'
import { ModalNames } from '@penx/constants'
import { sleep } from '@penx/shared'
import { addressMap, client, wagmiConfig } from '@penx/wagmi'

export type Values = {
  code: string
}

export type GenerateCodeModalData = {
  loading: boolean
  code: string
}

export function useGenerateReferralCodeForm() {
  const ctx = useModalContext<GenerateCodeModalData>()
  const form = useForm<Values>({
    defaultValues: {
      code: ctx.data?.code || '',
    },
  })

  const { refetch, data } = useReadContract({})

  const { writeContractAsync } = useWriteContract()

  const onSubmit: SubmitHandler<Values> = async (values) => {
    ctx?.setData?.({ ...ctx.data, loading: true })

    try {
      const referrer = await readContract(wagmiConfig, {
        address: addressMap.BelieverNFT,
        abi: believerNftAbi,
        functionName: 'getReferrer',
        args: [values.code],
      })

      if (referrer !== zeroAddress) {
        toast.success('This code is already used')
        ctx?.setData?.({ ...ctx.data, loading: false })
        return
      }

      await writeContractAsync({
        address: addressMap.BelieverNFT,
        abi: believerNftAbi,
        functionName: 'setReferralCode',
        args: [values.code],
      })
      await sleep(2000)
      toast.success('Set referral code successfully')
      ctx.close()
      modalController.open(ModalNames.MY_REFERRALS)
    } catch (error: any) {
      toast.info(error.shortMessage || error.message)
    }

    ctx?.setData?.({ ...ctx.data, loading: false })
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
