import yargs, { ArgumentsCamelCase } from 'yargs'
import chalk from 'chalk'
import fetch from 'node-fetch'

type Args = {
  text?: string[]
}

class Command {
  readonly command = 'add <text...>'
  readonly describe = 'Add text to PenX'

  cwd = process.cwd()

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    const { text = [] } = args
    const textStr = text.join(' ').trim()
    // console.log('=======textStr:', textStr)

    try {
      const response = await fetch('http://localhost:65432/add-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textStr,
        }),
      })

      await response.json()
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error(chalk.red('Please download and start PenX agent'))
      }
    }
  }
}

const add = new Command()

export default add
