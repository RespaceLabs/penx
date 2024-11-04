'use client'

import { Button } from '@/components/ui/button'
import { ELECTRIC_BASE_URL } from '@/lib/constants'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { useShape } from '@electric-sql/react'
import { User } from '@prisma/client'

export const dynamic = 'force-static'

const stream = new ShapeStream({
  url: `${ELECTRIC_BASE_URL}/v1/shape/site`,
})

stream.subscribe((messages) => {
  console.log('=======messages:', messages)
  //
})

const shape = new Shape(stream)

console.log('=====shape.isLoading:', shape.isLoading, shape.value)

// shape.subscribe((data) => {
//   console.log('rows=data========:', data)
//   // rows is an array of the latest value of each row in a shape.
// })

export default function Page() {
  return null
  const { data = [] } = useShape<User>({
    url: `${ELECTRIC_BASE_URL}/v1/shape/site`,
  })
  console.log('=====data:', data)

  // const items = useLiveQuery(`SELECT * FROM nodes;`)

  // console.log('=====items:', items)

  return (
    <div>
      <div>nodes...</div>
      <Button>Insert</Button>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <div>{item.id}</div>
            <div>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
