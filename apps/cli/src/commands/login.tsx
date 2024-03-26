import React from 'react'
import chalk from 'chalk'
import yargs, { ArgumentsCamelCase } from 'yargs'
import { render } from 'ink'
import { nanoid } from 'nanoid'
import open from 'open'
import ora from 'ora'
import { sleep, getBaseURL, writeTokenToLocal } from '../lib/utils'
import { LoginSuccess } from '../ui/LoginSuccess'
import { getTRPC } from '../lib/trpc'

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
        const { status } = await trpc.cli.getLoginStatus.query({ token: cliToken })

        // console.log('=======status:', status)

        if (status === CliLoginStatus.CONFIRMED) {
          break
        }

        if (status === CliLoginStatus.CANCELED) {
          // console.log('=========status:', status)

          spinner.fail('Login canceled')
          return
          // break
        }

        await sleep(2000)
      } catch (error) {
        spinner.fail('Login failed, please try again')
        // break
        return
      }
    }

    const { token, user } = await trpc.cli.loginByToken.mutate(cliToken)
    writeTokenToLocal(env as any, token, user)

    spinner.succeed('Login successfully')

    render(<LoginSuccess user={user} />)
  }
}

const command = new Command()

export default command
