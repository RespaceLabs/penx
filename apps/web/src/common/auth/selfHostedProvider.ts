import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import credentialsProvider from 'next-auth/providers/credentials'
import { hashPassword } from '@penx/api'
import { prisma } from '@penx/db'
import { initMySQL } from './initMySQL'
import { initPG } from './initPG'

function getDatabaseType(url = process.env.DATABASE_URL) {
  const type = process.env.DATABASE_TYPE || (url && url.split(':')[0])

  if (type === 'postgres') {
    return 'postgresql'
  }

  return type
}

const isDatabaseInited = async () => {
  const databaseType = getDatabaseType()

  if (!databaseType || !['mysql', 'postgresql'].includes(databaseType)) {
    throw new Error('Missing or invalid database')
  }

  try {
    const users = await prisma.user.findMany()
    // console.log('============users.len:', users.length)
    return true
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (
        error.code === 'P2021' ||
        error.message.includes('does not exist in the current database')
      ) {
        return false
      }
      throw error
    } else {
      throw error
    }
  }
}

async function loginByDefaultAccount(
  credentials?: Record<'username' | 'password', string>,
) {
  const username = process.env.SELF_HOSTED_USERNAME as string
  const password = process.env.SELF_HOSTED_PASSWORD as string

  if (
    username === credentials?.username &&
    password === credentials?.password
  ) {
    let user = await prisma.user.findFirst({
      where: { username, password },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: await hashPassword(password),
          name: username,
        },
      })
    }

    return {
      id: user.id,
      name: user.username || user.name,
      email: user.email || '',
      image: '',
    }
  } else {
    return null
  }
}

async function loginByUserPassword(
  credentials?: Record<'username' | 'password', string>,
) {
  const user = await prisma.user.findFirst({
    where: {
      username: credentials?.username,
    },
  })

  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Username not found',
    })
  }

  const match = await bcrypt.compare(
    credentials?.password || '',
    user.password || '',
  )

  if (!match) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid password',
    })
  }

  return {
    id: user.id,
    name: user.username || user.name,
    email: user.email || '',
    image: '',
  }
}

export const selfHostedProvider = credentialsProvider({
  name: 'SelfHosted',
  credentials: {
    username: { label: 'Username', type: 'text', placeholder: '' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials, req) {
    try {
      const inited = await isDatabaseInited()

      if (!inited) {
        const databaseType = getDatabaseType()

        if (databaseType === 'mysql') {
          await initMySQL()
        } else {
          await initPG()
        }

        return await loginByDefaultAccount(credentials)
      } else {
        const users = await prisma.user.findMany()
        if (!users.length) return await loginByDefaultAccount(credentials)

        return await loginByUserPassword(credentials)
      }
    } catch (error) {
      console.log('=====error:', error)
      return null
    }
  },
})
