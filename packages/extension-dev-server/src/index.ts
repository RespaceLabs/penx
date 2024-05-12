import EventEmitter from 'events'
import { join } from 'path'
import chokidar from 'chokidar'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import jetpack from 'fs-jetpack'
import ky from 'ky'

const eventEmitter = new EventEmitter()

const BUILD_SUCCESS = 'BUILD_SUCCESS'

export const devServer = {
  run(port = process.env.PORT || 5001) {
    const app: Express = express()
    app.use(cors())

    app.get('/', (req: Request, res: Response) => {
      const url = 'http://localhost:3000?key=extension-development'
      res.send(`
      <div style="padding: 20%">
        <h1>Penx extension</h1>
        <div style="padding: 0 0 20px 0">Click the link to start develop a extension:</div>
        <a href="${url}" target="_blank">${url}</a>
      </div>
      `)
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

    const manifestPath = join(process.cwd(), 'manifest.json')
    chokidar.watch(manifestPath).on('change', (event) => {
      eventEmitter.emit(BUILD_SUCCESS)
    })
  },

  async handleBuildSuccess() {
    console.log('Build success~')
    eventEmitter.emit(BUILD_SUCCESS)

    const data = getExtensionData()

    console.log('build success!!!!!!!!!')
    const result = await ky
      .post('http://127.0.0.1:8080/api/upsert-extension', {
        json: {
          id: data.id,
          name: data.name,
          version: data.version,
          code: data.code,
          commands: JSON.stringify(data.commands),
        },
      })
      .json()
    console.log('result--------:', result)
  },
}

type Command = {
  name: string
  title: string
  subtitle: string
  description: string
}

type ExtensionData = {
  name: string
  id: string
  version: string
  description: string
  main: string
  code: string
  commands: Command[]
}

function getExtensionData(): ExtensionData {
  const manifestPath = join(process.cwd(), 'manifest.json')
  const manifest = jetpack.read(manifestPath, 'json')
  const code = jetpack.read(join(process.cwd(), manifest.main), 'utf8')
  return { ...manifest, code }
}
