import { Control, Controller, useForm, useWatch } from 'react-hook-form'
import { Box } from '@fower/react'
import { Node, Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import { Input } from 'uikit'
import { useSelectedNode } from '../hooks/useSelectedNode'
import { CssEditor } from './fields/CssEditor'

const components: Record<string, any> = {
  Input: Input,
  CssEditor: CssEditor,
}

interface ConfigFormProps {
  node: Node
}

function useUpdateEditor(control: Control, node: Node) {
  const editor = useSlateStatic()
  const values = useWatch({ control })

  if (Object.keys(values).length) {
    Transforms.setNodes(
      editor,
      { ...values },
      {
        at: [],
        mode: 'highest',
        match: (n) => n.id === node.id,
      },
    )
  }
}

function ConfigForm({ node }: ConfigFormProps) {
  const editor = useSlateStatic()
  const elementInfo = editor.elementMaps[node.type]

  const { register, handleSubmit, watch, control, formState } = useForm<any>()
  useUpdateEditor(control, node)

  return (
    <Box p3 column gapY2>
      {elementInfo.configSchema?.map((item) => {
        const Component = components[item.component]

        if (!Component) return <Box>No match component</Box>

        return (
          <Box key={item.name}>
            <Box>{item.label || item.name}</Box>
            <Controller
              name={item.name}
              control={control}
              defaultValue={(node as any)?.[item.name] || item.defaultValue}
              render={({ field }) => <Component {...field} />}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export const ConfigPanel = () => {
  const { node } = useSelectedNode()

  if (!node) return null

  return (
    <Box>
      <ConfigForm node={node} />
    </Box>
  )
}
