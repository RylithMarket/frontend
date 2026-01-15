"use client";

import {
  useCreateVault,
  useDepositAsset,
  useVaultData,
} from "@/hooks/use-core-contracts";
import {
  useCreateKiosk,
  useListVault,
  useGetOwnedKiosks,
  useDelistVault,
} from "@/hooks/use-marketplace";
import {
  ConnectModal,
  useConnectWallet,
  useCurrentAccount,
  useCurrentWallet,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export function Test() {
  const { isConnected } = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);

  const createKioskMutation = useCreateKiosk();
  const listVaultMutation = useListVault();
  const unlistVaultMutation = useDelistVault();
  const { data: ownedKiosks } = useGetOwnedKiosks({
    payload: currentAccount?.address,
    options: { enabled: !!currentAccount?.address },
  });
  const { data: vault, isLoading: isVaultLoading } = useVaultData({
    payload:
      "0x7a9cf50f02871d1fc3a16890b0abcf33f34d81082a9fbe91960d47acbebcf768",
  });

  const handleListVault = () => {
    const kioskId = ownedKiosks?.kioskIds[0];
    if (!kioskId) {
      console.error("No kiosk found");
      return;
    }

    unlistVaultMutation.mutate({
      kioskId,
      itemId:
        "0x7a9cf50f02871d1fc3a16890b0abcf33f34d81082a9fbe91960d47acbebcf768",
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

  return (
    <div>
      {isVaultLoading ? (
        <p>Loading vault data...</p>
      ) : vault ? (
        <div>
          <h2>Vault Data:</h2>
          <p>ID: {vault.id}</p>
          <p>Name: {vault.name}</p>
          <p>Description: {vault.description}</p>
          <p>Strategy Type: {vault.strategyType}</p>
          <p>Created At: {new Date(vault.createdAt).toLocaleString()}</p>
          <p>Owner: {vault.owner}</p>
        </div>
      ) : (
        <p>No vault data found.</p>
      )}
    </div>
  );
}
