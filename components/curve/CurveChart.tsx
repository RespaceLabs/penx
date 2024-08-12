'use client'

import React, { memo, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { precision } from '@/lib/math'
import { cn } from '@/lib/utils'
import { BondingCurveLib } from '@/services/BondingCurveLib'
import { Curve } from '@/services/CurveService'
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
import { useDebouncedCallback } from 'use-debounce'

export function getSubTotal(
  fromSupply: number,
  quantity: number,
  curve: Curve,
) {
  let basePrice = curve.basePrice
  let inflectionPoint = curve.inflectionPoint
  let inflectionPrice = curve.inflectionPrice
  let linearPriceSlope = curve.linearPriceSlope
  return _subTotal(
    fromSupply,
    quantity,
    basePrice,
    inflectionPoint,
    inflectionPrice,
    linearPriceSlope,
  )
}

function _subTotal(
  fromSupply: number,
  quantity: number,
  basePrice: number,
  inflectionPoint: number,
  inflectionPrice: number,
  linearPriceSlope: number,
) {
  let subTotal = basePrice * quantity
  subTotal += BondingCurveLib.linearSum(linearPriceSlope, fromSupply, quantity)

  subTotal += BondingCurveLib.sigmoid2Sum(
    inflectionPoint,
    inflectionPrice,
    fromSupply,
    quantity,
  )
  return subTotal
}

function getPrice(supply: number, amount = 1, curve: Curve): number {
  const price = getSubTotal(supply, amount, curve)
  return Number(price)
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { supply, price } = payload[0].payload
    return (
      <div className="bg-white shadow rounded-lg text-sm p-2">
        <p>{`Supply: ${supply}`}</p>
        <p>{`Price: ${price.toFixed(5)} ETH`}</p>
      </div>
    )
  }
  return null
}

function getData(max: number = 100, curve: Curve = defaultCurve) {
  return Array(max)
    .fill('')
    .map((_, index) => index + 1)
    .map((i) => {
      const price = getPrice(i, 1, curve)
      const priceDecimal = precision.toDecimal(price)

      return {
        supply: i.toString(),
        price: priceDecimal,
      }
    })
}

export const defaultCurve: Curve = {
  basePrice: Number(precision.token(0.002)),
  inflectionPoint: 400,
  inflectionPrice: Number(precision.token(0.5)),
  linearPriceSlope: 0,
}

interface Props {
  className?: string
  max?: number
  curve?: Curve
}
type DataItem = { supply: string; price: number }

export const CurveChart = memo(
  function CurveChart({ className = '', curve = defaultCurve }: Props) {
    const [value, setValue] = useState('100')
    const [data, setData] = useState<DataItem[]>(getData(parseInt(value)))
    const [interval, updateInterval] = useState(parseInt(value) / 10)

    const debouncedSetData = useDebouncedCallback(async (value, curve) => {
      setData(getData(parseInt(value), curve))
    }, 400)

    useEffect(() => {
      debouncedSetData(value, curve)
    }, [curve, value])
    // console.log('supply:', value)

    const tvl = data.map((item) => item.price).reduce((a, b) => a + b)
    const fee = tvl * 0.075
    const yieldIncome = tvl * 0.05

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
                // setData(getData(len))
              }}
              type="single"
            >
              <ToggleGroupItem value="50" className="h-7">
                50
              </ToggleGroupItem>
              <ToggleGroupItem value="100" className="h-7">
                100
              </ToggleGroupItem>
              <ToggleGroupItem value="500" className="h-7">
                500
              </ToggleGroupItem>
              <ToggleGroupItem value="1000" className="h-7">
                1000
              </ToggleGroupItem>
              <ToggleGroupItem value="10000" className="h-7">
                10000
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              // width={500}
              height={200}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="30 30"  /> */}
              <CartesianGrid vertical={false} strokeWidth={1} />

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

        <div className="flex justify-center gap-3">
          <div className="flex-1 border rounded-xl p-4">
            <div className="text-neutral-400 text-sm">
              Creator fee(5%/per trade)
            </div>
            <div className="font-semibold text-xl">{fee.toFixed(5)} ETH</div>
          </div>
          <div className="flex-1 border rounded-xl p-4">
            <div className="text-neutral-400 text-sm">Year yield (5% apr)</div>
            <div className="font-semibold text-2xl">
              {yieldIncome.toFixed(5)} ETH
            </div>
          </div>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps)
  },
)
