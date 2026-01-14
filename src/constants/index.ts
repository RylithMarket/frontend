export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet";

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
  process.env.NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID || "";

export const MARKETPLACE_CONTRACT = {
  packageId: MARKETPLACE_PACKAGE_ID,
  moduleName: "marketplace",
};
