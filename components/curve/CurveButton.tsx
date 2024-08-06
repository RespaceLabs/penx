'use client'

import React, { forwardRef } from 'react'
import { ChartSpline } from 'lucide-react'
import { Button } from '../ui/button'

export const CurveButton = forwardRef<HTMLButtonElement, {}>(
  function CurveButton({}, ref) {
    return (
      <Button ref={ref} size="icon" variant="secondary">
        <ChartSpline className="text-neutral-500"></ChartSpline>
      </Button>
    )
  },
)
