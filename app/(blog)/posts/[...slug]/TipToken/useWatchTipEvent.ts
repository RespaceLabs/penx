import { tipAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { useWatchContractEvent } from 'wagmi'

export function useWatchTipEvent() {
  console.log('watch tip events...')

  useWatchContractEvent({
    address: addressMap.Tip,
    abi: tipAbi,
    eventName: 'TipRequestCreated',
    onLogs(logs) {
      console.log('1 logs: ', logs)
      for (const log of logs) {
        console.log('TipRequestCreated>>>>', log)
      }
    },
  })

  useWatchContractEvent({
    address: addressMap.Tip,
    abi: tipAbi,
    eventName: 'TipRequestExecuted',
    onLogs(logs) {
      console.log('2 logs: ', logs)
      for (const log of logs) {
        console.log('TipRequestExecuted>>>>', log)
      }
    },
  })

  useWatchContractEvent({
    address: addressMap.Tip,
    abi: tipAbi,
    eventName: 'TipRequestCancelled',
    onLogs(logs) {
      console.log('3 logs: ', logs)
      for (const log of logs) {
        console.log('TipRequestCancelled>>>>', log)
      }
    },
  })
}
