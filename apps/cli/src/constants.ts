import os from 'os'
import { join } from 'path'

export const PORT = 31415

export const PENX_DIRNAME = '.penx'

export const CONFIG_FILE_NAME = 'config.json'

// TODO: use sqlite in future
export const DB_FILE_NAME = 'db.json'

export const penxDir = join(os.homedir(), PENX_DIRNAME)

export const configPath = join(os.homedir(), PENX_DIRNAME, CONFIG_FILE_NAME)

export const dbPath = join(os.homedir(), PENX_DIRNAME, DB_FILE_NAME)

export enum EventType {
  ADD_NODES = 'ADD_NODES',
}

export type AddTextEvent = {
  eventType: EventType.ADD_NODES
  data: string
}
