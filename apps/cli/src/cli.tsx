#!/usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import add from './commands/add'
import login from './commands/login'

yargs(hideBin(process.argv))
  .command(add)
  .command(login)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .parse()
