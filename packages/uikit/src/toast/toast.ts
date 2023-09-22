import { ReactNode } from 'react'
import { toast as myToast } from 'sonner'
import { Options } from './types'

export function toast(msg: ReactNode, options?: Options) {
  return myToast(msg)
}

toast.info = (msg: ReactNode, options?: Options) => {
  return myToast(msg)
}

toast.success = (msg: ReactNode, options?: Options) => {
  return myToast(msg)
}

toast.error = (msg: ReactNode, options?: Options) => {
  return myToast(msg)
}

toast.warning = (msg: ReactNode, options?: Options) => {
  return myToast(msg)
}

toast.loading = (msg: ReactNode, options?: Options) => {
  return myToast(msg)
}
