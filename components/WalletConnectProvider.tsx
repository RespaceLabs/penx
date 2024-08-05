"use client";

import React, { ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { State, WagmiProvider } from "wagmi";
import { siweConfig } from "@/lib/wagmi/siweConfig";
import { wagmiConfig } from "@/lib/wagmi/wagmiConfig";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

// Create modal
createWeb3Modal({
  siweConfig: siweConfig,
  wagmiConfig: wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function WalletConnectProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  );
}
