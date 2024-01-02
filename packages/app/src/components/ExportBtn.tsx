import { PropsWithChildren } from 'react'
import { Button } from 'uikit'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'

function exportJSONToFile(data: object, fileName: string) {
  const jsonStr = JSON.stringify(data)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

interface Props {
  space?: ISpace
}

export const ExportBtn = (props: PropsWithChildren<Props>) => {
  async function exportSpace() {
    const space = props.space ? props.space : await db.getActiveSpace()
    const nodes = await db.listNodesBySpaceId(space.id)
    console.log('space', space, nodes)
    exportJSONToFile(
      {
        space,
        nodes,
      },
      space.id + '.json',
    )
  }
  return (
    <Button onClick={() => exportSpace()}>
      {props.children || 'Export entire space'}
    </Button>
  )
}
