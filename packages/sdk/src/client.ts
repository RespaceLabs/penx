import { Inbox } from './inbox'

interface Options {
  spaceId: string
}

export class Client {
  inbox: Inbox

  constructor(options: Options) {
    this.inbox = new Inbox(this)
  }
}
