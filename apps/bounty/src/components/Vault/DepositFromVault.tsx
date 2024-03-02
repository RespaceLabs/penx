import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Box } from '@fower/react'
import { useAccount, useWriteContract } from 'wagmi'
import { Button, Card, Radio, RadioGroup, RadioIndicator } from 'uikit'
import { daoVaultAbi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

type Inputs = {
  //
  token: any
  amount: string
}

export const DepositFromVault = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      token: addressMap.INK,
      amount: '100',
    },
  })
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('=======data.token:', data.token)

    try {
      await writeContractAsync({
        address: addressMap.DaoVault,
        abi: daoVaultAbi,
        functionName: 'transferERC20Token',
        args: [
          data.token,
          address!,
          precision.token(data.amount, data.token === addressMap.INK ? 18 : 6),
        ],
      })
      console.log('===========data:', data)
    } catch (error) {
      console.log('===========error:', error)
    }
  }

  return (
    <Card column gap4>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} column gap4>
        <Box>Token</Box>

        <Controller
          name="token"
          control={control}
          render={({ field }) => (
            <RadioGroup toCenterY w-100p gap6 {...field}>
              <Radio value={addressMap.INK}>
                <RadioIndicator />
                <Box>INK</Box>
              </Radio>
              {/* <Radio value={addressMap.USDC}>
                <RadioIndicator />
                <Box>USDC</Box>
              </Radio> */}
              <Radio value={addressMap.USDT}>
                <RadioIndicator />
                <Box>USDT</Box>
              </Radio>
            </RadioGroup>
          )}
        />

        <Box>Amount</Box>
        <Box
          as="input"
          px3
          py4
          outlineNone
          border
          rounded2XL
          type="text"
          defaultValue=""
          {...register('amount', { required: true })}
        />

        <Box>
          <Button
            size="lg"
            type="submit"
            flex-1
            w-100p
            gap2
            disabled={!isValid}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Card>
  )
}
