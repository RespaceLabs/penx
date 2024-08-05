import { div, times } from './math'

function isInt(v: any) {
  if (Number.isInteger(v)) return true
  return /^\d+$/.test(v.toString())
}

export enum Decimals {
  TOKEN = 18,
  RATE = 5,
  PRICE = 8,
  USD = 6,
}

export const precision = {
  token(value: number | string, decimal: number = Decimals.TOKEN) {
    if (isInt(value)) {
      return BigInt(Math.pow(10, decimal)) * BigInt(value)
    }
    return BigInt(times(Math.pow(10, decimal), value))
  },

  rate(value: number | string, decimal = Decimals.RATE) {
    if (isInt(value)) {
      return BigInt(Math.pow(10, decimal)) * BigInt(value)
    }
    return BigInt(times(Math.pow(10, decimal), value))
  },

  price(value: number | string, decimal = Decimals.PRICE) {
    if (isInt(value)) {
      return BigInt(Math.pow(10, decimal)) * BigInt(value)
    }
    return BigInt(parseInt(times(Math.pow(10, decimal), value) as any, 10))
  },

  toDecimal(value: bigint, decimals: number = Decimals.TOKEN) {
    if (!value) return 0
    return div(value.toString(), Math.pow(10, decimals))
  },

  toRateDecimal(value: bigint) {
    return div(value.toString(), Math.pow(10, Decimals.RATE))
  },
}
