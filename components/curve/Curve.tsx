'use client'

import React, { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { precision } from '@/lib/math'
import { cn } from '@/lib/utils'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function getPrice(supply: bigint, amount: bigint) {
  const basePrice = precision.token(0.001024)
  const factor = BigInt(50_000)
  const sumOfAmount =
    (_curve(supply + amount) - _curve(supply)) /
    precision.token(1) /
    precision.token(1) /
    factor
  const sumOfBasePrice = (basePrice * amount) / precision.token(1)
  return sumOfAmount + sumOfBasePrice
}

function _curve(x: bigint) {
  return x * x * x
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { supply, price } = payload[0].payload
    return (
      <div className="bg-white shadow rounded-lg text-sm p-2">
        <p>{`Supply: ${supply}`}</p>
        <p>{`Price: ${price} ETH`}</p>
      </div>
    )
  }
  return null
}

function getData(max: number) {
  return Array(max)
    .fill('')
    .map((_, index) => index + 1)
    .map((i) => {
      const price = getPrice(precision.token(i), precision.token(1))
      const priceDecimal = precision.toDecimal(price)

      return {
        supply: i.toString(),
        price: priceDecimal,
      }
    })
}

interface Props {
  className?: string
}
type DataItem = { supply: string; price: number }
export function Curve({ className = '' }: Props) {
  const [value, setValue] = useState('500')
  const [data, setData] = useState<DataItem[]>(getData(parseInt(value)))
  const [interval, updateInterval] = useState(parseInt(value) / 10)

  console.log('supply:', value)

  return (
    <div className={cn('', className)}>
      <div className="flex justify-end">
        <div className="flex items-center gap-1 mb-2">
          <div className="text-sm">Supply:</div>
          <ToggleGroup
            size="sm"
            value={value}
            onValueChange={(v) => {
              if (!v) return

              setValue(v)
              const len = parseInt(v)
              updateInterval(parseInt((len / 10).toString()))
              setData(getData(len))
            }}
            type="single"
          >
            <ToggleGroupItem value="100" className="h-7">
              100
            </ToggleGroupItem>
            <ToggleGroupItem value="500" className="h-7">
              500
            </ToggleGroupItem>
            <ToggleGroupItem value="1000" className="h-7">
              1000
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={200}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {/* <CartesianGrid strokeDasharray="30 30"  /> */}
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="supply"
              interval={interval}
              axisLine={false}
              tickLine={false}
            />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
