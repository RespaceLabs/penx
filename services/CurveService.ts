import { precision } from '@/lib/math'

export enum CurveTypes {
  PublicationMember = 'PublicationMember',
  ClubMember = 'ClubMember',
  GithubSponsor = 'GithubSponsor',
  PromotionSponsor = 'PromotionSponsor',
  Post = 'Post',
}

export type Curve = {
  basePrice: number
  inflectionPoint: number
  inflectionPrice: number
  linearPriceSlope: number
}

export class CurveService {
  curves = {
    [CurveTypes.ClubMember]: {
      basePrice: '50',
      inflectionPoint: '100',
      inflectionPrice: '2000',
      linearPriceSlope: '0',
    },
    [CurveTypes.PublicationMember]: {
      basePrice: '100',
      inflectionPoint: '100',
      inflectionPrice: '100',
      linearPriceSlope: '0',
    },
    [CurveTypes.GithubSponsor]: {
      basePrice: '400',
      inflectionPoint: '40',
      inflectionPrice: '2000',
      linearPriceSlope: '0',
    },
    [CurveTypes.PromotionSponsor]: {
      basePrice: '400',
      inflectionPoint: '40',
      inflectionPrice: '2000',
      linearPriceSlope: '0',
    },

    [CurveTypes.Post]: {
      basePrice: '5',
      inflectionPoint: '100',
      inflectionPrice: '2000',
      linearPriceSlope: '0',
    },
  }

  getStringFormat(type: `${CurveTypes}`) {
    const curve = this.curves[type]
    return curve
  }

  getNumberFormat(type: `${CurveTypes}`) {
    const curve = this.curves[type]
    return {
      basePrice: precision.token(curve.basePrice, 6),
      inflectionPoint: Number(curve.inflectionPoint),
      inflectionPrice: precision.token(curve.inflectionPrice, 6),
      linearPriceSlope: BigInt(curve.linearPriceSlope),
    }
  }
}
