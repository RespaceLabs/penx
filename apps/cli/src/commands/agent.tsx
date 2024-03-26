import yargs, { ArgumentsCamelCase } from 'yargs'
import fetch from 'node-fetch'
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
      await this.startServer()
    }

    if (cmd === AgentCommand.stop) {
      await this.stopServer()
    }

    if (cmd === AgentCommand.restart) {
      await this.restartServer()
    }
  }

  private async startServer() {
    const running = await this.isServerRunning()

    if (running) return

    const serverFile = join(__dirname, '..', 'server.js')
    const server = spawn('node', [serverFile], {
      detached: true,
      stdio: 'ignore',
      // stdio: 'pipe',
    })

    server.stdout?.on('data', (data) => {
      const log = data.toString()
      console.log(log)
    })

    server.stderr?.on('data', (data) => {
      const error = data.toString()
      console.error(error)
    })

    server.unref()
  }

  private async isServerRunning() {
    try {
      const url = `http://localhost:${PORT}/ping`
      const json = await (await fetch(url)).json()
      console.log('json.....:', json)
      return !!json?.ok
    } catch (error) {
      return false
    }
  }

  private async stopServer() {
    await killPortProcess(PORT)
  }

  private async restartServer() {
    await killPortProcess(PORT)
    await this.startServer()
    // TODO: restart server log
  }
}

const command = new Command()

export default command
