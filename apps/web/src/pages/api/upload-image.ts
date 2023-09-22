import { createClient } from '@supabase/supabase-js'
import CryptoJS from 'crypto-js'
import mime from 'mime'
import { NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string

function arrayBufferToHexString(arrayBuffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(arrayBuffer)

  let hexString = ''
  for (let i = 0; i < byteArray.length; i++) {
    const hex = byteArray[i].toString(16).padStart(2, '0')
    hexString += hex
  }

  return hexString
}

function calculateArrayBufferHash(arrayBuffer: ArrayBuffer): string {
  const hexString = arrayBufferToHexString(arrayBuffer)
  const hash = CryptoJS.MD5(hexString)
  return hash.toString(CryptoJS.enc.Hex)
}

async function md5File(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  return calculateArrayBufferHash(arrayBuffer)
}

async function checkFileExists(publicUrl: string): Promise<boolean> {
  const response = await fetch(publicUrl)
  return response.ok
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
  // {
  //   auth: {
  //     persistSession: true,
  //   },
  // },
)

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest, _: NextApiResponse) => {
  const formData = await req.formData()
  const file: File | null = formData.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({
      success: false,
      message: 'No file provided',
    })
  }

  const md5 = await md5File(file)
  const mimeType = mime.getType(file.name)
  const ext = mimeType ? mime.getExtension(mimeType) : ''

  const filePath = md5 + '.' + ext

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath)

  const existed = await checkFileExists(publicUrl)

  if (existed) {
    return NextResponse.json({
      success: true,
      filePath,
      publicUrl,
    })
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: mimeType || undefined,
    })

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    })
  } else {
    return NextResponse.json({
      success: false,
      filePath,
      publicUrl,
    })
  }
}

export default handler
