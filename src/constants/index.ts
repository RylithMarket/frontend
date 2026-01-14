export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet";
export const RYLITH_API_URL =
  process.env.NEXT_PUBLIC_RYLITH_API_URL || "http://localhost:8080";

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
  "0xccb4413dc994b079201db4dd0f91e8472618e8f5a5e3bc60a7ac831fa4181107";

export const MARKETPLACE_CONTRACT = {
  packageId: MARKETPLACE_PACKAGE_ID,
  moduleName: "venue",
};

export const MARKETPLACE_OBJECTS = {
  transferPolicy:
    "0xc78436a44352c8f784f47dc6ca436a69c6271fbef1d1f51c5746ad14dc8811ac",
  transferPolicyCap:
    "0xdf6c193c3a1289649a93c8ecdd51b62e624cd1663ee290ce6cfacadedb2f587b",
};
