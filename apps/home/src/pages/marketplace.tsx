import React from 'react'
import { TrpcProvider } from '@penx/trpc-client'
import { Marketplace } from '~/components/Marketplace/Marketplace'
import { BasicLayout } from '~/layouts/BasicLayout'

const Page = () => {
  return (
    <TrpcProvider>
      <Marketplace />
    </TrpcProvider>
  )
}

Page.Layout = BasicLayout

export default Page
