"use client";

import { useCreateVault, useDepositAsset } from "@/hooks/use-core-contracts";
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
import { useState } from "react";

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
      <div>
        {ownedKiosks?.kioskIds[0] && <p>✓ Kiosk: {ownedKiosks?.kioskIds[0]}</p>}
      </div>

      <div>
        <button
          onClick={handleListVault}
          disabled={listVaultMutation.isPending}
        >
          {listVaultMutation.isPending ? "Listing..." : "Delist Vault"}
        </button>
        {listVaultMutation.data && (
          <p>✓ Listed: {listVaultMutation.data.slice(0, 10)}...</p>
        )}
      </div>
    </div>
  );
}
