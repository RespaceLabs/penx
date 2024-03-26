import { getTRPC } from './trpc'
import { Space } from '../types'
import { select } from '@inquirer/prompts'
import { writeConfig } from './utils'

export async function selectSpace() {
  const trpc = await getTRPC()
  const spaces: Space[] = await trpc.space.mySpaces.query()

  const answer = await select({
    message: 'Select a space',
    // default
    choices: spaces.map((space) => ({
      name: `${space.name} (${space.id})`,
      value: space.id,
      description: `${space.description || space.name} (${space.id})`,
    })),
  })

  const space = spaces.find((space) => space.id === answer)!
  writeConfig({ space })
}
