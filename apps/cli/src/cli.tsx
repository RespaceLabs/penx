#!/usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import add from './commands/add'
import login from './commands/login'
import space from './commands/space'
import agent from './commands/agent'

yargs(hideBin(process.argv))
  .command(add)
  .command(login)
  .command(space)
  .command(agent)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .parse()
