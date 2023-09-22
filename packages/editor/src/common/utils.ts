import reactFastCompare from 'react-fast-compare'
import { nanoid } from 'nanoid'

export const isServer = typeof window === 'undefined'

export const isEqual = reactFastCompare

export const convertStringToArr = (str = '', pattern = ',') => {
  return (str || '').split(pattern).filter(Boolean)
}
