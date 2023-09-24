import React from 'react'
import { Database } from '@penx/indexeddb'

interface Users {
  id?: string
  username: string
  password: string
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

interface ToDos {
  id?: string
  userId: number
  title: string
  description: string
  done: boolean
  priority: Priority
}

const database = new Database({
  version: 1,
  name: 'Todo-list',
  tables: [
    {
      name: 'users',
      primaryKey: {
        name: 'id',
        autoIncrement: true,
        unique: true,
      },
      indexes: {
        username: {
          unique: false,
        },
      },
      timestamps: true,
    },
    {
      name: 'todos',
      primaryKey: {
        name: 'id',
        autoIncrement: true,
        unique: true,
      },
      indexes: {
        userId: {
          unique: true,
        },
      },
      timestamps: true,
    },
  ],
})

;(async () => {
  console.log('gogo.........')

  await database.connect()
  const users = database.useModel<Users>('users')
  const user = await users.insert({
    id: Date.now().toString(),
    username: 'admin',
    password: 'admin',
  })
  const todos = database.useModel<ToDos>('todos')
  await todos.insert({
    id: Date.now().toString(),
    userId: user.id,
    title: 'Todo 1',
    description: 'Description 1',
    done: false,
    priority: Priority.LOW,
  })
})()

const PageEditor = () => {
  return (
    <div>
      <div>Test</div>
    </div>
  )
}

export default PageEditor
