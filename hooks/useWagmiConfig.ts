import { useSiteContext } from '@/components/SiteContext'
import { getWagmiConfig } from '@/lib/wagmi'
import { AuthType } from '@prisma/client'

export function useWagmiConfig() {
  const { authType } = useSiteContext()
  return getWagmiConfig(authType === AuthType.PRIVY)
}
