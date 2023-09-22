import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { produce } from 'immer'
import mitt from 'mitt'

export type ModalState = {
  id: ID
  data: any
  visible: boolean
}

type ContextType = ModalState

type RegisterType = 'antd' | 'bone-ui' | 'mui' | (string & {})
type ID = any

type Events = {
  show: { id: any; data?: any }
  hide: { id: any; data?: any }
}

const emitter = mitt<Events>()

const context = createContext({} as ContextType)
const ModalProvider = context.Provider
const useModalContext = () => useContext(context)

export function useModal<T = any>() {
  const { id, visible, data } = useModalContext()

  const hide = () => {
    emitter.emit('hide', { id })
  }
  const show = () => {
    emitter.emit('show', { id })
  }
  return {
    visible,
    data: data as T,
    hide,
    show,
    register(type?: RegisterType) {
      const typeMaps: Record<RegisterType, any> = {
        antd: { visible, onClose: hide },
        'bone-ui': { isOpen: visible, onClose: hide },
        mui: { open: visible, onClose: hide },
      }

      return typeMaps[type!]
        ? typeMaps[type!]
        : Object.keys(typeMaps).reduce<Record<string, any>>(
            (acc, cur) => ({ ...acc, ...typeMaps[cur] }),
            {},
          )
    },
  }
}

const EasyModalContainer = () => {
  const [list, setList] = useState<ModalState[]>([])

  useEffect(() => {
    emitter.on('show', ({ id, data }) => {
      const newList = produce(list, (draft) => {
        const item = draft.find((i) => i.id === id)
        const visible = true
        if (item) {
          item.visible = visible
          item.data = data
        } else {
          draft.push({ visible, data, id })
        }
      })

      setList(newList)
    })
  }, [])

  useEffect(() => {
    emitter.on('hide', ({ id, data }) => {
      const newList = produce(list, (draft) => {})
      const item = list.find((i) => i.id === id)
      if (item) item.visible = false
      setList(newList)
    })
  }, [])

  return (
    <>
      {list.map((item, index) => {
        const Component = item.id
        // if (!item.visible) return null
        return (
          <ModalProvider value={item} key={index}>
            <Component />
          </ModalProvider>
        )
      })}
    </>
  )
}

export const EasyModalProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <EasyModalContainer />
  </>
)

export class EasyModal {
  static show(id: ID, data?: any) {
    emitter.emit('show', { id, data })
  }

  static hide(id: ID) {
    emitter.emit('hide', { id })
  }
}
