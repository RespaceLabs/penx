import React, { useEffect, useRef } from 'react';
import { createChart, Time, CandlestickData } from 'lightweight-charts';

interface Props {
  candles: ICandleChart[];
}

interface ICandle {
  _id: string;
  period: string;
  openTime: number;
  closeTime: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
  buyVolume: number;
  quoteBuyVolume: number;
}

export interface ICandleChart extends ICandle {
  time: number;
}

export interface ChartConfig {
  candle?: boolean;
  volume?: boolean;
  rsi?: number;
  roc?: number;
  ma?: number[];
  ema?: number[];
  bb?: number[];
  kdj?: number;
}

const defaultChartConfig: ChartConfig = {
  candle: true,
  volume: true,
  rsi: undefined,
  roc: undefined,
  ma: undefined,
  ema: undefined,
  bb: undefined,
  kdj: undefined,
};

const mode = 'light';

export default function Chart({ candles }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartConfig = defaultChartConfig;

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const { candle, volume, rsi, roc, kdj, bb, ...rest } = chartConfig;

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      height: 400,
    });

    chart.applyOptions({
      layout: {
        background: {
          color: mode === 'light' ? '#FFFFFF' : 'rgba(0,0,0,0)',
        },
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },
      grid: {
        vertLines: {
          color: mode === 'light' ? '#f0f3fa' : '#2B2B43',
        },
        horzLines: {
          color: mode === 'light' ? '#f0f3fa' : '#2B2B43',
        },
      },
      timeScale: {
        visible: true,
        timeVisible: true,
      },
      localization: {
        dateFormat: 'yyyy-MM-dd',
      },
    });

    /** Candlestick chart */
    if (candle) {
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const candleData: CandlestickData<Time>[] = candles.map((i) => ({
        time: i.time as Time,
        open: i.open,
        high: i.high,
        low: i.low,
        close: i.close,
      }));

      candleSeries.setData(candleData);
    }

    /** Trading volume */
    if (volume) {
      const volumes = candles.map((i) => ({
        time: i.time,
        value: i.volume,
        color: i.close > i.open ? '#26a69a' : '#ef5350',
      }));

      const volumeChart = chart.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      volumeChart.setData(volumes as any);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, chartConfig]);

  return <div className="w-full h-[400px]" ref={chartContainerRef} />
}
