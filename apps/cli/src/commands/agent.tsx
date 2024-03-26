import yargs, { ArgumentsCamelCase } from 'yargs'
import { spawn } from 'child_process'
import { join } from 'path'
import { killPortProcess } from 'kill-port-process'
import { PORT } from '../constants'

enum AgentCommand {
  start = 'start',
  stop = 'stop',
  restart = 'restart',
}

type Args = {
  cmd?: AgentCommand
}

class Command {
  readonly command = 'agent [cmd]'
  readonly describe = 'PenX Agent'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    const { cmd } = args
    if (!cmd) return

    if (cmd === AgentCommand.start) {
      this.startServer()
    }

    if (cmd === AgentCommand.stop) {
      await this.stopServer()
    }
  }

  private startServer() {
    const serverFile = join(__dirname, '..', 'server.js')
    const child = spawn('node', [serverFile], {
      detached: true,
      stdio: 'ignore',
    })

    child.unref()
  }

  private async stopServer() {
    await killPortProcess(PORT)
  }
}

const command = new Command()

export default command
