import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import {
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from 'viem/siwe'
import { NETWORK } from '@/lib/constants'
import { getBasePublicClient } from '@/lib/getBasePublicClient'
import {
  createUserByAddress,
  createUserByGoogleInfo,
  getServerSession,
  getSessionOptions,
  isGoogleLogin,
  isPasswordLogin,
  isWalletLogin,
  loginByPassword,
  SessionData,
} from '@/lib/session'
import { getAccountAddress } from '@/lib/utils'

export const runtime = 'edge'

// login
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )
  const json = await request.json()

  if (isGoogleLogin(json)) {
    const account = (await createUserByGoogleInfo(json))!

    session.isLoggedIn = true
    session.userId = account.userId
    session.address = getAccountAddress(account)
    session.name = account.user.name as string
    session.image = account.user.image as string
    session.role = account.user.role as string
    session.message = ''
    session.subscriptions = Array.isArray(account.user.subscriptions)
      ? account.user.subscriptions.map((i: any) => ({
          planId: i.planId,
          startTime: i.startTime,
          duration: i.duration,
        }))
      : []

    await session.save()

    return Response.json(session)
  }

  if (isWalletLogin(json)) {
    try {
      const siweMessage = parseSiweMessage(json?.message) as SiweMessage

      if (
        !validateSiweMessage({
          address: siweMessage?.address,
          message: siweMessage,
        })
      ) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const publicClient = getBasePublicClient(NETWORK)

      const valid = await publicClient.verifyMessage({
        address: siweMessage?.address,
        message: json?.message,
        signature: json?.signature as any,
      })

      if (!valid) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }
      const address = siweMessage.address
      const account = (await createUserByAddress(address.toLowerCase()))!

      session.isLoggedIn = true
      session.message = ''
      session.userId = account.userId
      session.address = address
      session.name = account.user.name as string
      session.image = account.user.image as string
      session.role = account.user.role as string
      session.subscriptions = Array.isArray(account.user.subscriptions)
        ? account.user.subscriptions.map((i: any) => ({
            planId: i.planId,
            startTime: i.startTime,
            duration: i.duration,
          }))
        : []

      await session.save()
      return Response.json(session)
    } catch (e) {
      console.log('wallet auth error======:', e)
    }
  }

  if (isPasswordLogin(json)) {
    try {
      const account = (await loginByPassword(json.username, json.password))!
      session.isLoggedIn = true
      session.message = ''
      session.userId = account.userId
      session.address = getAccountAddress(account)
      session.name = account.user.name as string
      session.image = account.user.image as string
      session.role = account.user.role as string
      session.subscriptions = Array.isArray(account.user.subscriptions)
        ? account.user.subscriptions.map((i: any) => ({
            planId: i.planId,
            startTime: i.startTime,
            duration: i.duration,
          }))
        : []

      await session.save()
      return Response.json(session)
    } catch (error: any) {
      console.log('error.mess==:', error.message)

      if (error.message === 'INVALID_USERNAME') {
        session.message = 'Invalid username'
      }

      if (error.message === 'INVALID_PASSWORD') {
        session.message = 'Invalid password'
      }

      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  session.isLoggedIn = false
  await session.save()
  return Response.json(session)
}

export async function PATCH() {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  session.updateConfig({
    ...sessionOptions,
    cookieOptions: {
      ...sessionOptions.cookieOptions,
      expires: new Date('2024-12-27T00:00:00.000Z'),
      maxAge: undefined,
    },
  })
  await session.save()

  return Response.json(session)
}

// read session
export async function GET() {
  const session = await getServerSession()

  if (session?.isLoggedIn !== true) {
    return Response.json({})
  }

  return Response.json(session)
}

// logout
export async function DELETE() {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  session.destroy()
  return Response.json({ isLoggedIn: false })
}
