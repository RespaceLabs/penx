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
      basePrice: '0.002',
      inflectionPoint: '400',
      inflectionPrice: '0.5',
      linearPriceSlope: '0',
    },
    [CurveTypes.PublicationMember]: {
      basePrice: '0.002',
      inflectionPoint: '500',
      inflectionPrice: '0.2',
      linearPriceSlope: '0',
    },
    [CurveTypes.GithubSponsor]: {
      basePrice: '0.002',
      inflectionPoint: '50',
      inflectionPrice: '0.2',
      linearPriceSlope: '0',
    },
    [CurveTypes.PromotionSponsor]: {
      basePrice: '0.002',
      inflectionPoint: '40',
      inflectionPrice: '0.6',
      linearPriceSlope: '0',
    },

    [CurveTypes.Post]: {
      basePrice: '0.002',
      inflectionPoint: '100',
      inflectionPrice: '0.3',
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
      basePrice: precision.token(curve.basePrice),
      inflectionPoint: Number(curve.inflectionPoint),
      inflectionPrice: precision.token(curve.inflectionPrice),
      linearPriceSlope: BigInt(curve.linearPriceSlope),
    }
  }
}
