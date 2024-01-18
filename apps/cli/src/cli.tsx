#!/usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import add from './commands/add'

yargs(hideBin(process.argv))
  .command(add)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .parse()
