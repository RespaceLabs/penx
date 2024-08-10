import { Creation } from '@/domains/Creation'
import { BondingCurveLib } from './BondingCurveLib'

const creatorFeePercent = BigInt(5)
const protocolFeePercent = BigInt(1)
const appFeePercent = BigInt(2)

export class BondingCurveService {
  constructor(private creation: Creation) {}
  getBuyPrice(amount: bigint) {
    return this._getPrice(amount, true)
  }

  getSellPrice(amount: bigint) {
    return this._getPrice(amount, false)
  }

  getBuyPriceAfterFee(amount: bigint) {
    return this._getPriceAfterFee(amount, true)
  }

  getSellPriceAfterFee(amount: bigint) {
    return this._getPriceAfterFee(amount, false)
  }

  _getPriceAfterFee(amount: bigint, isBuy: boolean) {
    const price = isBuy ? this.getBuyPrice(amount) : this.getSellPrice(amount)

    const creatorFee = (price * creatorFeePercent) / BigInt(100)
    const protocolFee = (price * protocolFeePercent) / BigInt(100)
    const appFee = (price * appFeePercent) / BigInt(100)
    const priceAfterFee = isBuy
      ? price + creatorFee + appFee + protocolFee
      : price - creatorFee - appFee - protocolFee
    return {
      priceAfterFee,
      price,
      creatorFee,
      appFee,
      protocolFee,
    }
  }

  _getPrice(amount: bigint, isBuy: boolean) {
    const supply = this.creation.supply
    const newSupply = isBuy ? supply : supply - amount
    return this.getSubTotal(newSupply, amount)
  }

  getSubTotal(fromSupply: bigint, quantity: bigint) {
    const curve = this.creation.curve
    let basePrice = curve.basePrice
    let inflectionPoint = curve.inflectionPoint
    let inflectionPrice = curve.inflectionPrice
    let linearPriceSlope = curve.linearPriceSlope
    return this._subTotal(
      Number(fromSupply),
      Number(quantity),
      Number(basePrice),
      inflectionPoint,
      Number(inflectionPrice),
      Number(linearPriceSlope),
    )
  }

  _subTotal(
    fromSupply: number,
    quantity: number,
    basePrice: number,
    inflectionPoint: number,
    inflectionPrice: number,
    linearPriceSlope: number,
  ) {
    let subTotal = basePrice * quantity

    subTotal += BondingCurveLib.linearSum(
      linearPriceSlope,
      fromSupply,
      quantity,
    )

    subTotal += BondingCurveLib.sigmoid2Sum(
      inflectionPoint,
      inflectionPrice,
      fromSupply,
      quantity,
    )
    return BigInt(subTotal)
  }
}
