import AVAX from './icons/AVAX.svg'
import BNB from './icons/BNB.svg'
import BTC from './icons/BTC.svg'
import DAI from './icons/DAI.svg'
import ETH from './icons/ETH.svg'
import USDC from './icons/USDC.svg'
import USDT from './icons/USDT.svg'

interface Props {
  size?: number
  token:
    | 'AVAX'
    | 'BNB'
    | 'BTC'
    | 'DAI'
    | 'ETH'
    | 'USDC'
    | 'USDT'
    | (string & {})
}

export const IconToken = ({ token, size = 32 }: Props) => {
  const maps: Record<string, any> = {
    AVAX,
    BNB,
    BTC,
    DAI,
    ETH,
    USDC,
    USDT,
  }

  const Icon = maps[token]

  return <Icon viewBox="0 0 128 128" width={size} height={size} />
}
