import reactFastCompare from 'react-fast-compare'

export const isServer = typeof window === 'undefined'

export const isEqual = reactFastCompare

export const convertStringToArr = (str = '', pattern = ',') => {
  return (str || '').split(pattern).filter(Boolean)
}
