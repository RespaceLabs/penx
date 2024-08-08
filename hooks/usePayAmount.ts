import { Creation } from '@/domains/Creation'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { readContract } from '@wagmi/core'
import { atom, useAtom } from 'jotai'

export const payAmountAtom = atom<string>('')

export function usePayAmount() {
  const [payAmount, setPayAmount] = useAtom(payAmountAtom)
  return { payAmount, setPayAmount }
}

export async function loadBuyPrice(
  creation: Creation,
  amount: number | string,
) {
  const { priceAfterFee } = await readContract(wagmiConfig, {
    address: addressMap.IndieX,
    abi: indieXAbi,
    functionName: 'getBuyPriceAfterFee',
    args: [creation.id, Number(amount), creation.appId],
  })
  return priceAfterFee
}
