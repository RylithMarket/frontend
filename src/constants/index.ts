export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet";
export const RYLITH_API_URL =
  process.env.NEXT_PUBLIC_RYLITH_API_URL || "http://localhost:8080";
export const DEFILLAMA_API_URL =
  process.env.NEXT_PUBLIC_DEFILLAMA_API_URL || "https://coins.llama.fi";
export const SUI_EXPLORER_URL =
  process.env.NEXT_PUBLIC_SUI_EXPLORER_URL || "https://suiscan.xyz/testnet";
export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_RYLITH_ROOT_DOMAIN || "rylith.space";

// Core Contract Configuration
export const CORE_PACKAGE_ID =
  process.env.NEXT_PUBLIC_CORE_PACKAGE_ID ||
  "0xbd990a04d0dc81dbfa1cd14457e6640046fa77981bdd855593f31cb99381cd1c";

export const VAULT_CONTRACT = {
  packageId: CORE_PACKAGE_ID,
  moduleName: "vault",
};

// Marketplace Contract Configuration
export const MARKETPLACE_PACKAGE_ID =
  process.env.NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID ||
  "0x96864f16919c535ee0a4ddc1948492f38a9d2eb4c0caa98076efaca772555d24";

export const MARKETPLACE_CONTRACT = {
  packageId: MARKETPLACE_PACKAGE_ID,
  moduleName: "venue",
};

export const MARKETPLACE_OBJECTS = {
  transferPolicy:
    "0xf2f0a61adaadc27dac432412bf54fa5b7fb484de240d9008d520d2478764d0ff",
  transferPolicyCap:
    "0x4cb2fee78f20e6bca915b97d3c53beb5c759d4b50a5a12aa778dd6ed4c43dad9",
};
