import { NETWORK } from "@/constants";
import { CetusClmmSDK } from "@cetusprotocol/sui-clmm-sdk";
import { getFullnodeUrl } from "@mysten/sui/client";

const cetusNetwork = NETWORK === "testnet" ? "testnet" : "mainnet";

export const cetusSdk = CetusClmmSDK.createSDK({
  env: cetusNetwork,
  full_rpc_url: getFullnodeUrl(cetusNetwork),
});
