'use client'

import { EditorApp } from '@/components/EditorApp/EditorApp'
import { ELECTRIC_BASE_URL } from '@/lib/constants'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { useShape } from '@electric-sql/react'
import { User } from '@prisma/client'

export const dynamic = 'force-static'

// const stream = new ShapeStream({
//   url: `${ELECTRIC_BASE_URL}/v1/shape/site`,
// })

// stream.subscribe((messages) => {
//   console.log('=======messages:', messages)
//   //
// })

// const shape = new Shape(stream)

// shape.subscribe((data) => {
//   console.log('rows=data========:', data)
//   // rows is an array of the latest value of each row in a shape.
// })

export default function Page() {
  return <EditorApp />
}
