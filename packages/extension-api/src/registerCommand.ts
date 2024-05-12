export function registerCommand(commandName: string, callback: () => void) {
  //
  console.log('registerCommand=========', commandName)

  self.addEventListener('message', (event) => {
    console.log('event.data========', event.data)
    if (event.data === commandName) {
      callback?.()
    }
  })
}
