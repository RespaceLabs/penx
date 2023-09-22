import { createContext, useContext } from 'react'
import { ModalContext } from './types'

export const modalContext = createContext({} as ModalContext)

export const ModalProvider = modalContext.Provider

export const useModalContext = <T>() => {
  return useContext(modalContext) as ModalContext<T>
}
