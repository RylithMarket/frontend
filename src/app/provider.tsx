/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NETWORK } from "@/constants";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as UIProvider } from "@/components/ui/provider";

const { networkConfig } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl(NETWORK as any),
  },
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={NETWORK as any}
      >
        <WalletProvider autoConnect>
          <UIProvider>{children}</UIProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
