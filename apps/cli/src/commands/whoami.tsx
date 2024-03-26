import yargs, { ArgumentsCamelCase } from 'yargs'

type Args = {}

class Command {
  readonly command = 'whoami'
  readonly describe = 'Retrieve your user information and test your authentication configuration.'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    // TODO:
  }
}

const command = new Command()

export default command
