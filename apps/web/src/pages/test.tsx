import React, { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Button, Textarea } from 'uikit'
import { db } from '@penx/local-db'
import { IPlugin } from '@penx/local-db/src/IPlugin'

function PluginItem({ plugin }: { plugin: IPlugin }) {
  const [code, setCode] = useState(plugin.code || '')
  return (
    <Box>
      <Box>{plugin.manifest.name}</Box>
      <Textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <Button
        onClick={() => {
          db.updatePlugin(plugin.id, { code })
        }}
      >
        Update
      </Button>
    </Box>
  )
}

const PageEditor = () => {
  const [plugins, setPlugins] = useState<IPlugin[]>([])
  useEffect(() => {
    db.listPlugins().then((plugins) => {
      setPlugins(plugins)
      console.log('plugins:', plugins)
    })
  }, [])
  return (
    <Box p10>
      <div>Test</div>
      <Box>
        {plugins.map((plugin) => (
          <PluginItem key={plugin.id} plugin={plugin}></PluginItem>
        ))}
      </Box>
    </Box>
  )
}

export default PageEditor
