import React from 'react'
import { NextSeo } from 'next-seo'
import { HomePage } from '~/components/HomePage/HomePage'
import { BasicLayout } from '~/layouts/BasicLayout'

const Page = () => {
  return (
    <>
      <HomePage></HomePage>
    </>
  )
}

Page.Layout = BasicLayout

export default Page
