import { createContext, useContext } from 'react'

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * avatar context
 */
export interface AvatarContext {
  imageLoadingStatus: ImageLoadingStatus
  onImageLoadingStatusChange(status: ImageLoadingStatus): void
}

export const avatarContext = createContext<AvatarContext>({} as AvatarContext)

export const AvatarProvider = avatarContext.Provider

export function useAvatarContext() {
  return useContext(avatarContext)
}

/**
 * Group context
 */

export interface AvatarGroupContext {
  max: number
}

export const avatarGroupContext = createContext<AvatarGroupContext>(
  {} as AvatarGroupContext,
)

export const AvatarGroupProvider = avatarGroupContext.Provider

export function useAvatarGroupContext() {
  return useContext(avatarGroupContext)
}
