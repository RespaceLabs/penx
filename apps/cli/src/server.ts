import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { EventEmitter } from 'events'
import { PORT } from './constants'

EventEmitter.defaultMaxListeners = 1000

async function run() {
  const app = express()
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }))
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(cors())

  app.get('/', async (req, res) => {
    res.json({
      hello: 'world',
      time: new Date(),
    })
  })

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
  })
}

run()
