import EventEmitter from 'events'
import { join } from 'path'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import jetpack from 'fs-jetpack'
import * as tsup from 'tsup'

const eventEmitter = new EventEmitter()

const BUILD_SUCCESS = 'BUILD_SUCCESS'

tsup.build({
  entry: ['main.ts'],
  format: 'esm',
  watch: true,
  async onSuccess() {
    console.log(BUILD_SUCCESS, '......')
    eventEmitter.emit(BUILD_SUCCESS)
  },
})

const port = process.env.PORT || 5001

const app: Express = express()
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server...')
})

app.get('/manifest.json', (req: Request, res: Response) => {
  const manifest = jetpack.read('./manifest.json', 'json')
  res.json(manifest)
})

app.get('/code', (req: Request, res: Response) => {
  res.json(getExtensionData().code)
})

app.get('/extension', (req: Request, res: Response) => {
  res.json(getExtensionData())
})

app.get('/extension-sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const data = `data: ${JSON.stringify(getExtensionData())}\n\n`
  res.write(data)

  function handler() {
    console.log('started', BUILD_SUCCESS)
    const data = `data: ${JSON.stringify(getExtensionData())}\n\n`
    res.write(data)
  }

  eventEmitter.on(BUILD_SUCCESS, handler)

  req.on('close', () => {
    eventEmitter.off(BUILD_SUCCESS, handler)
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

function getExtensionData() {
  const manifest = jetpack.read('./manifest.json', 'json')
  const code = jetpack.read(join(__dirname, manifest.main), 'utf8')
  return { ...manifest, code }
}
