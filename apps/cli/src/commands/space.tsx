import yargs, { ArgumentsCamelCase } from 'yargs'
import { select } from '@inquirer/prompts'
import { getTRPC } from '../trpc'
import { Space } from '../types'
import { writeConfig } from '../utils'

type Args = {
  env?: string[]
}

class Command {
  readonly command = 'space [command]'
  readonly describe = ''

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
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
}

const command = new Command()

export default command
