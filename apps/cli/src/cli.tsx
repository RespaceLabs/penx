#!/usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import command from './commands/add'
import login from './commands/login'
import space from './commands/space'
import agent from './commands/agent'
import whoami from './commands/whoami'

yargs(hideBin(process.argv))
  .command(command)
  .command(login)
  .command(space)
  .command(agent)
  .command(whoami)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .parse()
