import { PropsWithChildren } from 'react'
import { AssetDialog } from './AssetDialog/AssetDialog'
import { AssetList } from './AssetList'
import { AssetsNav } from './AssetsNav'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="">
      <AssetsNav />
      {children}
    </div>
  )
}
