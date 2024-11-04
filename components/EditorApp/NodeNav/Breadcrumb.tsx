import { useNodeContext, useNodes } from '@/lib/node-hooks'
import { NodeService } from '@/lib/service'
import { store } from '@/store'
import { BreadcrumbPopover } from './BreadcrumbPopover'

export const Breadcrumb = () => {
  const { nodes } = useNodes()
  const { node } = useNodeContext()
  if (!node) return null

  const nodeService = new NodeService(node, nodes)
  const parentNodes = nodeService.getParentNodes()

  return (
    <div className="flex items-center justify-center text-sm gap-1 w-auto">
      {parentNodes.map((node, index) => {
        const isLast = index === parentNodes.length - 1
        if (node.isList) return null
        return (
          <div className="flex items-center text-sm gap-1" key={node.id}>
            <div
              className="cursor-pointer text-foreground/60 max-w-40"
              onClick={() => {
                if (node.isDatabaseRoot) {
                  store.router.routeTo('DATABASES')
                } else {
                  nodeService.selectNode(node)
                }
              }}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.title || 'Untitled'}
            </div>
            {!isLast && <BreadcrumbPopover node={node} />}
          </div>
        )
      })}
    </div>
  )
}
