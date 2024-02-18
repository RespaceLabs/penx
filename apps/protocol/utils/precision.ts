export const precision = {
  token(value: number | string | bigint, decimal = 18) {
    return BigInt(Math.pow(10, decimal)) * BigInt(value)
  },

  pow(value: number | string | bigint, decimal = 18) {
    return BigInt(Math.pow(10, decimal)) * BigInt(value)
  },
}
