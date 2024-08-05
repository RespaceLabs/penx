'use client'

import React from 'react'
import { precision } from '@/lib/math'
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

const data = Array(100)
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

export function Curve() {
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
  return (
    <div className="h-[400px] mt-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
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
            interval={9}
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
  )
}
