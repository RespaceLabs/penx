import { createContext, useContext } from 'react'

export interface ProtectionContext {
  depth: number
  maxDepth: number
  minDepth: number
  parentId: string
}

export const protectionContext = createContext<ProtectionContext>(
  {} as ProtectionContext,
)

export const ProtectionProvider = protectionContext.Provider

export function useProtectionContext() {
  return useContext(protectionContext)
}
