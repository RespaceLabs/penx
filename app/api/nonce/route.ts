import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    let nonce = generateNonce()
    return new Response(nonce || 'default_nonce')
  } catch (error: any) {
    console.error('Error generating nonce:', error)
    return Response.json({
      foo: 'bar',
      error: error?.toString(),
    })
  }
}

function generateNonce(length: number = 16): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let nonce = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    nonce += characters[randomIndex]
  }
  return nonce
}
