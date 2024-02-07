import SmeeClient from 'smee-client'

console.log('starting smee-client...........')

const smee = new SmeeClient({
  source: 'https://smee.io/vvo2kfdXDEsDQvNT',
  target: 'http://localhost:3000/api/github-bot-webhook',
  logger: console,
})

const events = smee.start()
