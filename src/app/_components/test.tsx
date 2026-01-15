"use client";

import { useCetusRemoveLiquidityFromVault } from "@/hooks/use-cetus";
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
  const cetusRemoveLiqudityFromVaultMutation =
    useCetusRemoveLiquidityFromVault();

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

  const handleRemoveLiquidity = () => {
    cetusRemoveLiqudityFromVaultMutation.mutate({
      vaultId:
        "0x7a9cf50f02871d1fc3a16890b0abcf33f34d81082a9fbe91960d47acbebcf768",
      positionName: "cetus_lp_position",
      poolId:
        "0xc0b2d0d3ef3851f176235953616cd7799bede294a828ce3871ef110447859a78",
      positionId:
        "0xde24f378ecd23cad4c80730de808580a07c223d76961e511b776c44a6cad7151",
      coinTypeA:
        "a1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
      coinTypeB:
        "0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
      deltaLiquidity: "65173",
      minAmountA: "0",
      minAmountB: "0",
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
      <button onClick={handleListVault}>Delist Vault</button>
      <button onClick={handleRemoveLiquidity}>Remove Liquidity</button>
    </div>
  );
}
