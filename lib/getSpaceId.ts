'use client'

export function getSpaceId() {
  const site = (window as any).__SITE__
  return site?.spaceId as string
}
