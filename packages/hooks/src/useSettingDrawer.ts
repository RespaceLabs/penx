import { atom, useAtom } from 'jotai'
import { SettingsType } from '@penx/constants'

const settingDrawerAtom = atom({
  isOpen: false,
  type: SettingsType.ACCOUNT_SETTINGS,
  spaceId: '',
})

export function useSettingDrawer() {
  const [state, setState] = useAtom(settingDrawerAtom)
  return {
    ...state,
    open: (type: SettingsType, spaceId: string) => {
      setState({
        isOpen: true,
        type,
        spaceId,
      })
    },
    close: () =>
      setState({
        ...state,
        isOpen: false,
      }),
  }
}
