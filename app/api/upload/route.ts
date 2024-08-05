import { put } from '@vercel/blob'
import mime from 'mime'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    )
  }

  const file = req.body || ''
  const contentType = req.headers.get('content-type') || 'text/plain'
  // const contentType = req.headers.get('content-type') || 'text/plain'
  // const filename = `${nanoid()}.${contentType.split('/')[1]}`
  const ext = mime.getExtension(contentType)
  // console.log('=======ext:', ext, 'contentType:', contentType)

  const filename = `${nanoid()}.${ext}`
  const blob = await put(filename, file, {
    contentType,
    access: 'public',
  })

  return NextResponse.json(blob)
}
