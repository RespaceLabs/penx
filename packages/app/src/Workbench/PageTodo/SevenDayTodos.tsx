import { useEffect, useState } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Box } from '@fower/react'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { useTodos } from '@penx/node-hooks'
import { Draggable } from './dragDropTodo/Draggable'
import { Droppable } from './dragDropTodo/Droppable'

interface DayTodo {
  dayKey: string
  time: string
  tasks: INode[]
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function formatDateToDay(dateObject: Date): string {
  const year = dateObject.getFullYear()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const day = String(dateObject.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isBeforeToday(today: Date, createdAt: Date): boolean {
  return today.getTime() > createdAt.getTime()
}

function updateTodo(
  index: number,
  initialTasksByDay: DayTodo[],
  todoNodeRaw: INode,
): DayTodo {
  return {
    ...initialTasksByDay[index],
    tasks: [...initialTasksByDay[index].tasks, todoNodeRaw],
  }
}

export const SevenDayTodos = () => {
  const { todos } = useTodos()
  const [tasksByDay, setTasksByDay] = useState<DayTodo[]>([])
  const [dateList, setDateList] = useState<string[]>([])

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    const dayKey = active?.data?.current?.dayKey
    if (dayKey && over?.id) {
      const nodeId = active?.id.toString()
      const dayTaskDrag = tasksByDay.find((item) => {
        return item.dayKey === dayKey
      })

      const todosDrag = dayTaskDrag?.tasks || []

      const indexToRemove = todosDrag.findIndex((task) => task.id === nodeId)

      const removedTask: INode[] = []
      if (indexToRemove !== -1) {
        removedTask.push(...todosDrag.splice(indexToRemove, 1))
      }

      const dayTaskDrop = tasksByDay.find((item) => {
        return item.dayKey === over?.id
      })

      if (dayTaskDrop?.tasks && removedTask) {
        dayTaskDrop?.tasks.push(...removedTask)
      }

      if (event.over?.id !== dayKey && dayTaskDrop?.time) {
        db.updateNode(nodeId, { createdAt: new Date(dayTaskDrop.time) })
      }

      setTasksByDay([...tasksByDay])
    }
  }

  useEffect(() => {
    const today = new Date()
    const dates: string[] = []
    const initialTasksByDay: DayTodo[] = []
    const indexMap = new Map<string, number>()
    for (let i = 0; i < 7; i++) {
      const taskDay = new Date(today)
      taskDay.setDate(today.getDate() + i)
      const time = formatDateToDay(taskDay)
      const tasks: INode[] = []
      if (dateList.length < 7) {
        dates.push(time)
      }
      indexMap.set(time, i)

      initialTasksByDay.push({
        dayKey: daysOfWeek[taskDay.getDay()],
        time,
        tasks,
      })
    }

    todos.forEach((todo) => {
      const createdAt = todo?.todoNode.raw?.createdAt
      const createdDay = formatDateToDay(createdAt)

      if (dates.includes(createdDay)) {
        const index = indexMap.get(createdDay)
        if (index !== undefined) {
          initialTasksByDay[index] = updateTodo(
            index,
            initialTasksByDay,
            todo.todoNode.raw,
          )
        }
      } else if (isBeforeToday(today, createdAt)) {
        const index = indexMap.get(formatDateToDay(today))
        if (index !== undefined) {
          initialTasksByDay[index] = updateTodo(
            index,
            initialTasksByDay,
            todo.todoNode.raw,
          )
        }
      }
    })

    setTasksByDay(initialTasksByDay)

    if (dateList.length < 7) {
      setDateList(dates)
    }
  }, [])

  return (
    <Box row mt4>
      <DndContext onDragEnd={onDragEnd}>
        {tasksByDay.map((dayTodo) => (
          <Droppable key={dayTodo.dayKey} id={dayTodo.dayKey}>
            <Box w="260" h="800" roundedMD border px2 mr10>
              <Box as="h3" py2>
                {dayTodo.dayKey}
              </Box>
              {dayTodo.tasks.map((task) => {
                let text = ''
                if (Array.isArray(task.element)) {
                  text = task.element[0]?.children[0]?.text
                } else {
                  text = task.element?.children?.[0]?.text
                }

                return (
                  <Draggable
                    key={task.id}
                    data={{ taskId: task.id, dayKey: dayTodo.dayKey }}
                  >
                    {text || '-'}
                  </Draggable>
                )
              })}
            </Box>
          </Droppable>
        ))}
      </DndContext>
    </Box>
  )
}
