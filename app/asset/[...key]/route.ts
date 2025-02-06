import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { isProd } from '@/lib/constants'
import { getServerSession } from '@/lib/session'
import { db } from '@/server/db'
import { assets } from '@/server/db/schema'
import { PhotonImage, resize, SamplingFilter } from '@cf-wasm/photon/next'
// import { PhotonImage, resize, SamplingFilter } from '@cf-wasm/photon'

import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function PUT(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.isLoggedIn) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const from = formData.get('from') as 'POST' | 'ASSET'
  const file = formData.get('file') as File
  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/asset\//, '')
  const { env } = getRequestContext()

  try {
    const res = await env.BUCKET.put(key, file)
    try {
      await db.insert(assets).values({
        userId: session.userId,
        url: key,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        isPublic: from === 'POST',
        createdAt: file.lastModified ? new Date(file.lastModified) : new Date(),
      })
    } catch (error: any) {
      console.log('=======error:', error, 'key:', key)
      // 8c9d32527900c4e2016f002b2a8c0c7c3a3389990a955d790b7c207d3d61ebad
    }

    return Response.json({
      ...res,
      msg: `Put ${key} successfully!`,
      key: key,
    })
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: JSON.stringify(error, null, 2),
      },
      { status: 400 },
    )
  }
}

// read session
export async function GET(request: NextRequest) {
  const { env } = getRequestContext()
  const session = await getServerSession()
  const url = new URL(request.url)

  /** hack for version */
  if (url.pathname === '/asset/penx-version') {
    return Response.json({ version: '0.1.3' })
  }

  const size = url.searchParams.get('s') || ''

  const key = url.pathname.replace(/^\/asset\//, '')

  if (session?.isLoggedIn) return await renderAsset(key, size)
  // if (!asset) return await renderAsset(key, size)

  // if (!asset?.isPublic) {
  //   return new Response('Unauthorized', { status: 401 })
  // }
  return await renderAsset(key, size)
}

// logout
export async function DELETE(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.isLoggedIn) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { env } = getRequestContext()
  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/asset\//, '')
  await env.BUCKET.delete(key)
  return new Response('Deleted!')
}

export async function POST(request: NextRequest) {
  return Response.json({
    foo: 'bar',
  })
}

async function renderAsset(key: string, size = '') {
  const { env } = getRequestContext()
  const [asset, object] = await Promise.all([
    db.query.assets.findFirst({
      where: eq(assets.url, key),
      columns: { isPublic: true, contentType: true },
    }),
    env.BUCKET.get(key),
  ])

  if (object === null) {
    return new Response('Object Not Found', { status: 404 })
  }

  let output: Uint8Array<ArrayBufferLike> | ReadableStream<any>

  let width = Number(size || '0')

  const resizeSupported = ['image/png', 'image/jpeg', 'image/webp'].includes(
    asset?.contentType || '',
  )

  try {
    if (width === 0 || !resizeSupported) {
      output = object.body
    } else {
      // Resize the image using Photon.js
      const originalImageBuffer = await object.arrayBuffer()

      const inputImage = PhotonImage.new_from_byteslice(
        new Uint8Array(originalImageBuffer),
      )

      width = width > inputImage.get_width() ? inputImage.get_width() : width

      const height = (width * inputImage.get_height()) / inputImage.get_width()

      const outputImage = resize(
        inputImage,
        width,
        height,
        SamplingFilter.Nearest,
      )

      output = outputImage.get_bytes_webp()
      outputImage.free()

      inputImage.free()
    }

    const headers = new Headers()

    if (isProd) {
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)
    }

    if (asset?.contentType) {
      headers.set('Content-Type', asset?.contentType)
    }

    return new Response(output, {
      headers,
    })
  } catch (error) {
    return Response.json({
      foo: 'bar',
      error: JSON.stringify(error),
    })
  }
}
