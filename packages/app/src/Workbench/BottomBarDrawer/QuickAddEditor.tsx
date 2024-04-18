import { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { Clock, Hash, X } from 'lucide-react'
import { Button, Checkbox, toast } from 'uikit'
import { ELEMENT_P, ELEMENT_TAG, ELEMENT_TODO } from '@penx/constants'
import { useBottomBarDrawer, useRouterStore } from '@penx/hooks'
import { db, getCommonNode, getNewNode } from '@penx/local-db'
import { Node } from '@penx/model'
import { store } from '@penx/store'
import { QuickAddTag } from './QuickAddTag'

export const QuickAddEditor = () => {
  const { close } = useBottomBarDrawer()
  const ref = useRef<HTMLTextAreaElement>(null)

  const [value, setValue] = useState('')
  const [isTodo, setIsTodo] = useState(false)
  const [databases, setDatabases] = useState<Node[]>([])

  const { isTodos } = useRouterStore()

  function selectTag(node: Node) {
    if (databases.map((d) => d.id).includes(node.id)) {
      setDatabases(databases.filter((d) => d.id !== node.id))
    } else {
      setDatabases([...databases, node])
    }

    ref.current?.focus()
  }

  async function addWithTags() {
    const spaceId = store.space.getActiveSpace().id
    const children: any[] = [{ text: value }, { text: ' ' }]
    const element: any = {
      type: isTodo ? ELEMENT_TODO : ELEMENT_P,
      children,
    }
    const divider = { text: ' ' }

    const tags = databases.map((d) => ({
      type: ELEMENT_TAG,
      databaseId: d.id,
      trigger: '#',
      name: d.tagName,
      isOpen: false,
      children: [{ text: '#' + d.tagName }],
    }))

    tags.forEach((tag, index) => {
      if (index === tags.length - 1) {
        children.push(...[tag, divider])
        // children.push(tag)
      } else {
        children.push(tag)
      }
    })

    const newNode = getCommonNode({
      spaceId,
      element,
    })

    const newTodayNode = await db.addNodesToToday(spaceId, [newNode])

    for (const tag of tags) {
      await db.createTagRow(spaceId, tag.name, newNode.id)
    }

    if (isTodo) {
      await db.createTodoRow(spaceId, newNode.id, newTodayNode.id)
    }

    const nodes = await db.listNodesBySpaceId(spaceId)

    store.node.setNodes(nodes)
    store.node.selectNode(newTodayNode)
  }

  async function send() {
    if (!value) return

    if (databases.length > 0) {
      addWithTags()
    } else {
      if (isTodo) {
        store.node.addTodo(value, isTodos())
      } else {
        store.node.addTextToToday(value)
      }
    }
    close()
  }

  return (
    <Box>
      <Box flex px4 toTop toBetween py1>
        <Box toTop gap2 flex-1>
          {isTodo && (
            <Box textXL py3 toCenter>
              <Box h-1em>
                <Checkbox defaultChecked={false} />
              </Box>
            </Box>
          )}

          <TextareaAutosize
            ref={ref}
            autoFocus
            minRows={3}
            placeholder="Write something..."
            className={css({
              borderNone: true,
              overflowHidden: true,
              flex: 1,
              placeholderNeutral300: true,
              outline: 'none',
              resize: 'none',
              textXL: true,
              leadingSnug: true,
              fontFamily: 'unset',
              py: 12,
            })}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Box>
        <Box py3>
          {databases.length > 0 && (
            <Box toCenterY gap2 flexWrap>
              {databases.map((node) => {
                return (
                  <Box
                    key={node.id}
                    toCenterY
                    textXS
                    gray400
                    roundedFull
                    h-28
                    px-6
                    gap1
                    bg--T92={node?.tagColor}
                    bg--T88--hover={node?.tagColor}
                    color={node?.tagColor}
                    color--D4--hover={node?.tagColor}
                    onClick={() => selectTag(node)}
                  >
                    <Box>#{node.tagName}</Box>
                    <Box circle4 bg={node?.tagColor} white toCenter>
                      <X size={14} />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </Box>

      <Box mt1 toBetween toCenterY px4>
        <Box toCenterY gap2>
          <Checkbox
            checked={isTodo}
            onChange={(e) => {
              setIsTodo(e.target.checked)
              ref.current?.focus()
            }}
          />
          <Box inlineFlex gray500>
            <Hash size={20} strokeWidth={1} />
          </Box>

          <Box
            inlineFlex
            gray500
            onClick={() => {
              toast.info('Coming soon!')
            }}
          >
            <Clock size={20} strokeWidth={1} />
          </Box>
          {/* <Box inlineFlex gray500>
            <Star size={20} />
          </Box> */}
        </Box>
        <Button
          size={32}
          textXS
          px3
          py0
          colorScheme="black"
          // variant="light"
          gap1
          onClick={() => send()}
        >
          <Box>Save</Box>
        </Button>
      </Box>
      <Box px2 pt2>
        <QuickAddTag
          onSelect={(node) => {
            selectTag(node)
          }}
        />
      </Box>
    </Box>
  )
}
