import { useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Button, Input, Spinner, toast } from 'uikit'
import { believerFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

const emptyAddress = '0x0000000000000000000000000000000000000000'

const checkCode = (value: string): boolean => {
  if (!/^\d{4,8}$/.test(value)) {
    return false
  }

  return true
}

export function SetReferral() {
  const { address } = useAccount()
  const { writeContractAsync, isLoading } = useWriteContract()
  const [code, setCode] = useState<string>('')
  const [inviterCode, setInviterCode] = useState<string>('')
  const [disabledInput, setDisabledInput] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputInviterRef = useRef<HTMLInputElement>(null)

  const { data, isLoading: isReadLoading } = useReadContract({
    address: addressMap.Diamond,
    abi: believerFacetAbi,
    functionName: 'getUserInfo',
    args: [address!],
  })

  const onModify = () => {
    if (disabledInput) {
      setDisabledInput(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }

  useEffect(() => {
    if (!isReadLoading && rCode) {
      setCode(rCode.toString())
    }
  }, [data, isReadLoading])

  // TODO: any need fix
  const { rCode, inviter } = useMemo<{ rCode: number; inviter: any }>(() => {
    return {
      rCode: data ? Number(data?.code) : 0,
      inviter: data?.inviter,
    }
  }, [data])

  if (!data) {
    return null
  }

  console.log('%c=render', 'color:red', data, { rCode, inviter })

  return (
    <Box>
      {disabledInput && rCode !== 0 ? (
        <Box flex toCenterY>
          Your Referral Code:
          <Box w="200px" toCenterY h="36px" border rounded-10px ml="8px">
            {' '}
            <Box as="span" pl="8px">
              {rCode}
            </Box>
          </Box>
          <Button colorScheme="cyan500" onClick={onModify} size={'sm'} ml2>
            Modify Referral Code
          </Button>
        </Box>
      ) : (
        <Box>
          Your Referral Code:
          <Input
            ref={inputRef}
            value={code}
            w="200px"
            ml="8px"
            onChange={(e) => {
              setCode(e.target.value)
            }}
          />
          {rCode !== 0 ? (
            <Button
              size={'sm'}
              gap2
              ml2
              colorScheme="cyan500"
              disabled={isLoading}
              onClick={async () => {
                try {
                  if (!checkCode(code.toString())) {
                    toast.info('Please enter a valid 4-8 digit integer code.')

                    return
                  }

                  await writeContractAsync({
                    address: addressMap.Diamond,
                    abi: believerFacetAbi,
                    functionName: 'modifyInviteCode',
                    args: [BigInt(code), address!],
                  })

                  setDisabledInput(false)
                } catch (error: any) {
                  setCode(rCode.toString())
                  toast.info(error.message)
                }
              }}
            >
              {isLoading && <Spinner white />}
              Submit Referral Code
            </Button>
          ) : (
            <Button
              size={'sm'}
              gap2
              ml2
              disabled={isLoading}
              colorScheme="cyan500"
              onClick={async () => {
                try {
                  if (!checkCode(code.toString())) {
                    toast.info('Please enter a valid 4-8 digit integer code.')

                    return
                  }

                  await writeContractAsync({
                    address: addressMap.Diamond,
                    abi: believerFacetAbi,
                    functionName: 'registerReferralCode',
                    args: [BigInt(code), address!],
                  })

                  setDisabledInput(true)
                } catch (error: any) {
                  toast.info(error.message)
                  setCode('')
                }
              }}
            >
              {isLoading && <Spinner white />}
              Set Referral Code
            </Button>
          )}
        </Box>
      )}

      <Box pt4 pb4>
        <Box>
          When your friend enters your referral code mint NFTs, you will receive
          a 5% reward and the friend will receive a 5% discount.
        </Box>

        <Box pt2>
          {inviter === emptyAddress ? (
            <>
              <Input
                ref={inputInviterRef}
                value={inviterCode}
                w="200px"
                ml="8px"
                onChange={(e) => {
                  setInviterCode(e.target.value)
                }}
              />
              <Button
                size={'sm'}
                gap2
                ml2
                colorScheme="cyan500"
                disabled={isLoading}
                onClick={async () => {
                  try {
                    if (inviterCode.toString() === code.toString()) {
                      toast.info(
                        'Cannot set own referral code,please change the code',
                      )

                      return
                    }

                    if (!checkCode(inviterCode.toString())) {
                      toast.info('Please enter a valid 4-8 digit integer code.')

                      return
                    }

                    await writeContractAsync({
                      address: addressMap.Diamond,
                      abi: believerFacetAbi,
                      functionName: 'setInviter',
                      args: [address!, BigInt(inviterCode)],
                    })

                    setDisabledInput(false)
                  } catch (error: any) {
                    setCode(rCode.toString())
                    toast.info(error.message)
                  }
                }}
              >
                Set Inviter Code
              </Button>
            </>
          ) : (
            <Box>
              Your inviter: {inviter}.When you mint NFTs, you will enjoy 5% ETH
              back.
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
