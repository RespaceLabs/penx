import { div, times } from './math'
export enum Decimals {
  TOKEN = 18,
  RATE = 5,
  PRICE = 8,
  USD = 6,
}

export const precision = {
  token(value: number | string | bigint, decimal = 18) {
    return BigInt(Math.pow(10, decimal)) * BigInt(value)
  },

  pow(value: number | string | bigint, decimal = 18) {
    return BigInt(Math.pow(10, decimal)) * BigInt(value)
  },

  rate(value: number | string | bigint, decimal = 5) {
    return BigInt(Math.pow(10, decimal)) * BigInt(value)
  },

  toTokenDecimal(value: bigint) {
    return div(value.toString(), Math.pow(10, Decimals.TOKEN))
  },
}
