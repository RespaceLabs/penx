'use client'

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { GoogleAnalytics } from 'nextjs-google-analytics'

interface Props {
  gaMeasurementId: string
}

export function Analytics({ gaMeasurementId }: Props) {
  return <GoogleAnalytics trackPageViews gaMeasurementId={gaMeasurementId} />
}
