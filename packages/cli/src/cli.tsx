#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import add from './commands/add'
import dev from './commands/dev'
import release from './commands/release'
import login from './commands/login'
import space from './commands/space'
import agent from './commands/agent'
import whoami from './commands/whoami'

yargs(hideBin(process.argv))
  .command(add)
  .command(login)
  .command(dev)
  .command(release)
  .command(space)
  .command(agent)
  .command(whoami)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .demandCommand(1)
  .parse()
