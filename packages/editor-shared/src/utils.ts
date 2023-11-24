import reactFastCompare from 'react-fast-compare'
import { uniqueId } from '@penx/unique-id'

export const isServer = typeof window === 'undefined'

export const isEqual = reactFastCompare

/**
 * generate ID for DB
 * @returns
 */
export function genId() {
  return uniqueId()
}

export const convertStringToArr = (str = '', pattern = ',') => {
  return (str || '').split(pattern).filter(Boolean)
}
