import { Curve } from '@/services/CurveService'
import Big from 'big.js'

export function getSubTotal(
  fromSupply: number,
  quantity: number,
  curve: Curve,
) {
  let basePrice = curve.basePrice
  let inflectionPoint = curve.inflectionPoint
  let inflectionPrice = curve.inflectionPrice
  let linearPriceSlope = curve.linearPriceSlope
  return _subTotal(
    fromSupply,
    quantity,
    basePrice,
    inflectionPoint,
    inflectionPrice,
    linearPriceSlope,
  )
}

function _subTotal(
  fromSupply: number,
  quantity: number,
  basePrice: number,
  inflectionPoint: number,
  inflectionPrice: number,
  linearPriceSlope: number,
) {
  let subTotal = basePrice * quantity
  subTotal += BondingCurveLib.linearSum(linearPriceSlope, fromSupply, quantity)

  subTotal += BondingCurveLib.sigmoid2Sum(
    inflectionPoint,
    inflectionPrice,
    fromSupply,
    quantity,
  )
  return subTotal
}

export class BondingCurveLib {
  static sigmoid2Sum(
    inflectionPoint: number,
    inflectionPrice: number,
    fromSupply: number,
    quantity: number,
  ): number {
    let g = new Big(inflectionPoint)
    let h = new Big(inflectionPrice)

    // Early return to save computation if either `g` or `h` is zero.
    if (g.times(h).eq(0)) return 0

    let s = new Big(fromSupply).plus(1)
    let end = s.plus(quantity)
    let quadraticEnd = new Big(Math.min(inflectionPoint, end.toNumber()))

    let sum = new Big(0)

    if (s.lt(quadraticEnd)) {
      let k = new Big(fromSupply) // `s - 1`
      let n = quadraticEnd.minus(1)
      // In practice, `h` (units: wei) will be set to be much greater than `g * g`.
      let a = h.div(g.times(g))
      // Use the closed form to compute the sum.
      sum = n
        .times(n.plus(1))
        .times(n.times(2).plus(1))
        .minus(k.times(k.plus(1)).times(k.times(2).plus(1)))
        .div(6)
        .times(a)
      s = quadraticEnd
    }

    if (s.lt(end)) {
      let c = g.times(3).div(4)
      let h2 = h.times(2)
      while (s.lt(end)) {
        let r = s.minus(c).times(g).sqrt()
        sum = sum.plus(h2.times(r).div(g))
        s = s.plus(1)
      }
    }

    return sum.toNumber()
  }

  static linearSum(
    linearPriceSlope: number,
    fromSupply: number,
    quantity: number,
  ) {
    let m = new Big(linearPriceSlope)
    let k = new Big(fromSupply)
    let n = k.plus(quantity)
    // Use the closed form to compute the sum.
    return m
      .times(
        n
          .times(n.plus(1))
          .minus(k.times(k.plus(1)))
          .div(2),
      )
      .toNumber()
  }
}
