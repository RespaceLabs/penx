'use client'

import { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { StatusBar, Style } from '@capacitor/status-bar'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { get, set } from 'idb-keyval'
import { getAuthorizedUser } from '@penx/storage'
import { StoreProvider } from '@penx/store'
import { TrpcProvider } from '@penx/trpc-client'
import { ClientOnly } from './ui/ClientOnly'
// import { DesktopHome } from './ui/DesktopHome'
import MobileEditor from './ui/MobileEditor'

setupIonicReact({})

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', async (status) => {
    try {
      await StatusBar.setStyle({
        style: status.matches ? Style.Dark : Style.Light,
      })
    } catch {}
  })

const AppShell = () => {
  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    getAuthorizedUser().then((data) => {
      setIsLogin(!!data)
    })
  }, [])

  console.log('======isLogin:', isLogin)

  return (
    <ClientOnly>
      <StoreProvider>
        <TrpcProvider>
          <IonApp>
            {/* <IonReactRouter>
            <IonRouterOutlet id="main"></IonRouterOutlet>
          </IonReactRouter> */}

            {/* {!isLogin && <DesktopHome />} */}
            {isLogin && <MobileEditor />}
          </IonApp>
        </TrpcProvider>
      </StoreProvider>
    </ClientOnly>
  )
}

export default AppShell
