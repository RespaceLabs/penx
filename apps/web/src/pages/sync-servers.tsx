import React from 'react'
import { SyncServer } from '@penx/app'
import { CommonLayout } from '~/layouts/CommonLayout'

const PageSyncServers = () => {
  return <SyncServer />
}

export default PageSyncServers

PageSyncServers.Layout = CommonLayout
