import { MARKETPLACE_PACKAGE_ID, NETWORK } from "@/constants";
import { KioskClient, Network, RuleResolvingParams } from "@mysten/kiosk";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const networkKiosk = NETWORK === "testnet" ? Network.TESTNET : Network.MAINNET;

export const suiClient = new SuiClient({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url: getFullnodeUrl(NETWORK as any),
});

export const kioskClient = new KioskClient({
  client: suiClient,
  network: networkKiosk,
});

kioskClient.addRuleResolver({
  rule: `${MARKETPLACE_PACKAGE_ID}::royalty_rule::Rule`,
  packageId: MARKETPLACE_PACKAGE_ID,
  resolveRuleFunction: (params: RuleResolvingParams) => {
    const {
      transaction,
      itemType,
      packageId,
      extraArgs,
      transferRequest,
      policyId,
    } = params;
    const { royaltyPayment } = extraArgs;

    if (!royaltyPayment) throw new Error("Royalty payment not supplied");

    transaction.moveCall({
      target: `${packageId}::royalty_rule::pay`,
      typeArguments: [itemType],
      arguments: [
        transaction.object(policyId), // &TransferPolicy
        transferRequest,
        transaction.object(royaltyPayment),
      ],
    });
  },
});
