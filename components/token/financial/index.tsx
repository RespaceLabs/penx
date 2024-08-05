import { useEffect, useState } from 'react'
import Chart, { ICandleChart } from './Chart'
import { kData } from './mock'
import { KLineInterval, IntervalSelect } from './IntervalSelect'

export const Financial = () => {
  const [candles, setCandles] = useState<ICandleChart[]>([])
  const [price, setPrice] = useState<string>('0.00000')

  useEffect(() => {
    const candleData = kData.map((i) => {
      return {
        ...i,
        time: (i.openTime + 1000 * 60 * 60 * 8) / 1000,
      }
    })

    setCandles(candleData)
  }, [])

  const rangeCallback = (interval: KLineInterval) => {
    console.log('%c===rangeCallback', 'color:red', interval)
  }

  return <>
    <div className='flex items-center'>
      <div className='mr-[10px]'>
        <span>
          BNB/USDC
        </span>
      </div>
      <IntervalSelect callback={rangeCallback} />
    </div>
    <div>{price}</div>
    <Chart candles={candles} />
  </>
}