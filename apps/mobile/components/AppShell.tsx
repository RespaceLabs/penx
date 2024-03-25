'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';

import Tabs from './pages/Tabs';
import { DesktopHome } from './ui/DesktopHome';
import { StoreProvider } from '@penx/store';
import { TrpcProvider } from '@penx/trpc-client';

setupIonicReact({});

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', async status => {
    try {
      await StatusBar.setStyle({
        style: status.matches ? Style.Dark : Style.Light,
      });
    } catch {}
  });

const AppShell = () => {
  return (
    <StoreProvider>
      <TrpcProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet id="main">
              {/* <Route path="/" render={() => <Tabs />} /> */}
              <div>GOGO</div>
              <DesktopHome></DesktopHome>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </TrpcProvider>
    </StoreProvider>
  );
};

export default AppShell;
