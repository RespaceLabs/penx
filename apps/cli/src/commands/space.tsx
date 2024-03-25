import yargs, { ArgumentsCamelCase } from 'yargs'
import { selectSpace } from '../selectSpace'

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
    await selectSpace()
  }
}

const command = new Command()

export default command
