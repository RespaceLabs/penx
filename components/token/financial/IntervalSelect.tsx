import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useState } from "react";

export interface Props {
  callback: (interval: KLineInterval) => void;
}

export type KLineInterval = '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

const kLineIntervals: KLineInterval[] = [
  '5m',
  '15m',
  '1h',
  '4h',
  '1d',
  '1w'
];

export const IntervalSelect = ({ callback }: Props) => {
  const [selectedInterval, setSelectedInterval] = useState<KLineInterval>('5m');

  const handleSelect = (interval: KLineInterval) => {
    setSelectedInterval(interval);
    callback(interval);
  };

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger className="px-2 py-1 bg-blue-500 text-white rounded">
        {selectedInterval}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content className="bg-white shadow-lg rounded p-2 z-50">
          <div className="flex flex-col">
            {kLineIntervals.map((interval) => (
              <PopoverPrimitive.Close asChild key={interval}>
                <button
                  onClick={() => handleSelect(interval)}
                  className={`py-1 px-2 text-left hover:bg-blue-100 ${selectedInterval === interval ? 'font-bold' : ''}`}
                >
                  {interval}
                </button>
              </PopoverPrimitive.Close>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
