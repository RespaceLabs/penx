import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { EventEmitter } from 'events'
import { AddTextEvent, EventType, PORT } from './constants'
import { nodeService } from './lib/NodeService'
import { CronJob } from 'cron'

EventEmitter.defaultMaxListeners = 1000

const emitter = new EventEmitter()

async function run() {
  const app = express()
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }))
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(cors())

  app.get('/', async (req, res) => {
    res.json({
      items: nodeService.readItems(),
      hello: 'Hello world!',
    })
  })

  app.get('/ping', async (req, res) => {
    res.json({ ok: true })
  })

  app.all('/add-text', (req, res) => {
    const { method } = req
    if (!['POST', 'GET'].includes(method)) {
      res.json({ success: false })
      return
    }

    const text = method === 'POST' ? req.body.text : req.query['text']

    nodeService.addText(text)

    const data = nodeService.readItems()

    emitter.emit(EventType.ADD_NODES, {
      eventType: EventType.ADD_NODES,
      data,
    })

    res.json({
      success: true,
    })
  })

  app.post('/add-nodes', (req, res) => {
    const nodes = req.body.nodes

    // console.log('==========nodes:', nodes)

    nodeService.addNodes(nodes)

    const data = nodeService.readItems()

    emitter.emit(EventType.ADD_NODES, {
      eventType: EventType.ADD_NODES,
      data,
    })

    res.json({
      success: true,
    })
  })

  app.get('/add-nodes-successfully', async (req, res) => {
    nodeService.clearDB()
    // console.log('successfully added nodes======')

    res.json({
      success: true,
    })
  })

  app.get('/agent-sse', (req, res) => {
    // app.post("/agent-sse", (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const data = `data: ${JSON.stringify({})}\n\n`
    res.write(data)

    emitter.on(EventType.ADD_NODES, (ev: AddTextEvent) => {
      const msg = JSON.stringify(ev)
      const data = `data: ${msg}\n\n`
      res.write(data)
    })

    req.on('close', () => {
      // console.log("close=========");
      // TODO: how to unsubscribe?
      // redis.unsubscribe(CHANNEL);
    })
  })

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
  })

  const job = new CronJob(
    '*/10 * * * * *', // ten seconds
    function () {
      console.log('You will see this message every second')
    }, // onTick
    null, // onComplete
    true, // start
    'America/Los_Angeles', // timeZone
  )
}

run()
