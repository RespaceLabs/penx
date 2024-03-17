import React from 'react'
import fetch from 'node-fetch'
import yargs, { ArgumentsCamelCase } from 'yargs'
import { render } from 'ink'
import { nanoid } from 'nanoid'
import open from 'open'
import ora from 'ora'
import { sleep, getBaseURL, writeTokenToLocal } from '../utils'
import { LoginSuccess } from '../ui/LoginSuccess'
import { getTRPC } from '../trpc'

type Args = {
  env?: string[]
}

enum CliLoginStatus {
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  INIT = 'INIT',
}

class Command {
  readonly command = 'login [env]'
  readonly describe = 'PenX CLI Login'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    const cliToken = nanoid()
    const { env = 'prod' } = args
    const baseURL = getBaseURL(env as any)
    const url = `${baseURL}/cli-login?token=${cliToken}`
    open(url)

    const trpc = await getTRPC(env as any)
    console.log(`Logging, ${url}`)
    const spinner = ora('Please confirm login in the browser...').start()

    while (true) {
      try {
        const res = await fetch(`${baseURL}/api/cli-auth/get-status?token=${cliToken}`)

        const json = await res.json()

        if (json?.status === CliLoginStatus.CONFIRMED) {
          break
        }

        await sleep(200)
      } catch (error) {
        spinner.fail('Login failed, please try again')
        break
      }
    }

    const { token, user } = await trpc.user.loginByCliToken.mutate(cliToken)
    writeTokenToLocal(env as any, token, user)

    spinner.succeed('Login successfully')

    render(<LoginSuccess user={user} />)
  }
}

const command = new Command()

export default command
