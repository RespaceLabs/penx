export enum GateType {
  FREE = 'FREE',
  KEY_HOLDER = 'KEY_HOLDER',
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum TradeSource {
  MEMBER = 'MEMBER',
  SPONSOR = 'SPONSOR',
  HOLDER = 'HOLDER',
}

export const INDIE_X_APP_ID = BigInt(1)

export const SELECTED_SPACE = 'SELECTED_SPACE'

export enum CurveType {
  PublicationMember = 'PublicationMember',
  ClubMember = 'ClubMember',
  GithubSponsor = 'GithubSponsor',
}

export const Curves = {
  [CurveType.ClubMember]: {
    basePrice: '50',
    inflectionPoint: '100',
    inflectionPrice: '2000',
    linearPriceSlope: '0',
  },
  [CurveType.PublicationMember]: {
    basePrice: '100',
    inflectionPoint: '100',
    inflectionPrice: '100',
    linearPriceSlope: '0',
  },
  [CurveType.GithubSponsor]: {
    basePrice: '400',
    inflectionPoint: '40',
    inflectionPrice: '2000',
    linearPriceSlope: '0',
  },
}
