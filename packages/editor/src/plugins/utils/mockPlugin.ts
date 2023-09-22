export const mockPlugin = <P = {}>(plugin?: any): any => ({
  key: '',
  type: '',
  editor: {},
  inject: {},
  options: {} as any,
  ...plugin,
})
