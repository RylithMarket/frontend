"use client";

import { useCreateVault } from "@/hooks/use-core-contracts";
import {
  ConnectModal,
  useConnectWallet,
  useCurrentAccount,
  useCurrentWallet,
} from "@mysten/dapp-kit";
import { useState } from "react";

export function Test() {
  const { isConnected } = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const { mutate: connect } = useConnectWallet();
  const createVaultMutation = useCreateVault();

  const handleCreateVault = () => {
    createVaultMutation.mutate({
      name: "My First Vault",
      description: "This is a test vault",
      strategyType: "conservative",
    });
  };

  if (!isConnected) {
    return (
      <ConnectModal
        trigger={
          <button disabled={!!currentAccount}>
            {" "}
            {currentAccount ? "Connected" : "Connect"}
          </button>
        }
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
      />
    );
  }
  return <button onClick={handleCreateVault}>Create Vault</button>;
}
