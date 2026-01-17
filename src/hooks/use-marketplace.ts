import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { kioskClient } from "@/utils/suiClient";
import { VAULT_CONTRACT } from "@/constants";
import { HookProps, MutationHooksOptions, QueryHookOptions } from "./types";
import { Transaction } from "@mysten/sui/transactions";
import {
  KioskData,
  KioskOwnerCap,
  KioskTransaction,
  OwnedKiosks,
} from "@mysten/kiosk";
import { toaster } from "@/components/ui/toaster";

interface ListVaultPayload {
  kioskId?: string;
  vaultId: string;
  price: bigint | number | string;
}

interface PurchaseVaultPayload {
  kioskId: string;
  itemId: string;
  price: bigint | number | string;
}

interface DelistVaultPayload {
  itemId: string;
}

export interface KioskItemDetail {
  objectId: string;
  kioskId: string;
  type: string;
  price?: bigint;
  isListed: boolean;
  isExclusive: boolean;
  data?: Record<string, unknown>;
}

interface CreateKioskPayload {
  name?: string;
}

const ROYALTY_BPS = 150;
const MIN_ROYALTY_AMOUNT = 100_000;
const SUI_DECIMALS = 9;
function calculateRoyaltyAmount(price: bigint): bigint {
  const expectedAmount = (price * BigInt(ROYALTY_BPS)) / BigInt(10_000);
  return expectedAmount > BigInt(MIN_ROYALTY_AMOUNT)
    ? expectedAmount
    : BigInt(MIN_ROYALTY_AMOUNT);
}

async function getSuiCoinsForPayment(
  suiClient: ReturnType<typeof useSuiClient>,
  userAddress: string,
  requiredAmount: bigint,
) {
  const coins = await suiClient.getCoins({
    owner: userAddress,
    coinType: "0x2::sui::SUI",
  });

  const availableCoins = coins.data || [];
  const selectedCoins: typeof availableCoins = [];
  let totalAmount = BigInt(0);

  for (const coin of availableCoins) {
    if (totalAmount >= requiredAmount) break;
    selectedCoins.push(coin);
    totalAmount += BigInt(coin.balance);
  }

  if (totalAmount < requiredAmount) {
    throw new Error(
      `Insufficient SUI balance. Required: ${requiredAmount}, Available: ${totalAmount}`,
    );
  }

  return selectedCoins;
}

export function useCreateKiosk({
  options,
}: HookProps<
  CreateKioskPayload,
  MutationHooksOptions<string, Error, CreateKioskPayload>
> = {}): UseMutationResult<string, Error, CreateKioskPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!currentAccount) {
        throw new Error("No connected account");
      }

      const tx = new Transaction();

      const kioskTx = new KioskTransaction({ transaction: tx, kioskClient });

      kioskTx.create().shareAndTransferCap(currentAccount.address).finalize();

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              toaster.create({
                title: "Success",
                description: "Kiosk created successfully",
                type: "success",
                duration: 4000,
                closable: true,
              });
              resolve(result.digest);
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["kiosks"] });
              queryClient.invalidateQueries({ queryKey: ["owned-kiosks"] });
            },
            onError: (error) => {
              toaster.create({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to create kiosk",
                type: "error",
                duration: 4000,
                closable: true,
              });
              reject(error);
            },
          },
        );
      });
    },
    ...options?.options,
  });
}

export function useListVault({
  options,
}: HookProps<
  ListVaultPayload,
  MutationHooksOptions<string, Error, ListVaultPayload>
> = {}): UseMutationResult<string, Error, ListVaultPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const createKioskMutation = useCreateKiosk();
  const currentAccount = useCurrentAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ListVaultPayload) => {
      let kioskIds: string[] = [];
      let kioskOwnerCaps: KioskOwnerCap[] = [];

      if (!currentAccount) {
        throw new Error("No connected account");
      }

      const { kioskIds: initKioskIds1, kioskOwnerCaps: initKioskOwnerCaps } =
        await kioskClient.getOwnedKiosks({
          address: currentAccount.address,
        });
      kioskIds = initKioskIds1;
      kioskOwnerCaps = initKioskOwnerCaps;

      if (kioskIds.length === 0 || kioskOwnerCaps.length === 0) {
        await createKioskMutation.mutateAsync({});
      }

      const { kioskIds: newKioskIds, kioskOwnerCaps: newKioskOwnerCaps } =
        await kioskClient.getOwnedKiosks({
          address: currentAccount.address,
        });

      kioskIds = newKioskIds;
      kioskOwnerCaps = newKioskOwnerCaps;

      const tx = new Transaction();

      const kioskTx = new KioskTransaction({
        transaction: tx,
        kioskClient,
        cap: kioskOwnerCaps[0],
      });

      const kioskId = payload.kioskId || kioskIds[0];

      const price = BigInt(payload.price.toString());

      const kioskResult = await kioskClient.getKiosk({
        id: kioskId,
      });

      if (!kioskResult) throw new Error("Kiosk not found");

      kioskTx
        .place({
          itemType: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`,
          item: tx.object(payload.vaultId),
        })
        .list({
          itemId: payload.vaultId,
          itemType: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`,
          price,
        })
        .finalize();

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              toaster.create({
                title: "Success",
                description: "Vault listed for sale successfully",
                type: "success",
                duration: 4000,
                closable: true,
              });
              resolve(result.digest);
            },
            onSettled: () => {
              queryClient.invalidateQueries({
                queryKey: ["kiosk-items", kioskId],
              });
              queryClient.invalidateQueries({
                queryKey: ["all-listed-vaults"],
              });
            },
            onError: (error) => {
              toaster.create({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to list vault",
                type: "error",
                duration: 4000,
                closable: true,
              });
              reject(error);
            },
          },
        );
      });
    },
    ...options?.options,
  });
}

export function usePurchaseVault({
  options,
}: HookProps<
  PurchaseVaultPayload,
  MutationHooksOptions<string, Error, PurchaseVaultPayload>
> = {}): UseMutationResult<string, Error, PurchaseVaultPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const createKioskMutation = useCreateKiosk();
  const currentAccount = useCurrentAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PurchaseVaultPayload) => {
      if (!currentAccount) throw new Error("No connected account");

      const price = BigInt(payload.price.toString());

      let { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
        address: currentAccount.address,
      });

      if (kioskIds.length === 0 || kioskOwnerCaps.length === 0) {
        await createKioskMutation.mutateAsync({});
        const result = await kioskClient.getOwnedKiosks({
          address: currentAccount.address,
        });
        kioskIds = result.kioskIds;
        kioskOwnerCaps = result.kioskOwnerCaps;
      }

      const tx = new Transaction();

      const [royaltyCoin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(MIN_ROYALTY_AMOUNT),
      ]);

      const kioskTx = new KioskTransaction({
        transaction: tx,
        kioskClient,
        cap: kioskOwnerCaps[0],
      });

      await kioskTx.purchaseAndResolve({
        itemType: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`,
        sellerKiosk: payload.kioskId,
        itemId: payload.itemId,
        price: price,
        extraArgs: {
          royaltyPayment: royaltyCoin,
        },
      });

      kioskTx.finalize();

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              toaster.create({
                title: "Success",
                description: "Vault purchased successfully",
                type: "success",
                duration: 4000,
                closable: true,
              });
              resolve(result.digest);
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["kiosk-items"] });
              queryClient.invalidateQueries({
                queryKey: ["all-listed-vaults"],
              });
            },
            onError: (error) => {
              toaster.create({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to purchase vault",
                type: "error",
                duration: 4000,
                closable: true,
              });
              reject(error);
            },
          },
        );
      });
    },
    ...options?.options,
  });
}

export function useDelistVault({
  options,
}: HookProps<
  DelistVaultPayload,
  MutationHooksOptions<string, Error, DelistVaultPayload>
> = {}): UseMutationResult<string, Error, DelistVaultPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();

  return useMutation({
    mutationFn: async (payload: DelistVaultPayload) => {
      if (!currentAccount) {
        throw new Error("No connected account");
      }

      const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({
        address: currentAccount.address,
      });

      const tx = new Transaction();
      const kioskTx = new KioskTransaction({
        transaction: tx,
        kioskClient,
        cap: kioskOwnerCaps[0],
      });

      kioskTx
        .delist({
          itemId: payload.itemId,
          itemType: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`,
        })
        .transfer({
          itemId: payload.itemId,
          itemType: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`,
          address: currentAccount.address,
        })
        .finalize();

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              toaster.create({
                title: "Success",
                description: "Vault removed from sale",
                type: "success",
                duration: 4000,
                closable: true,
              });
              resolve(result.digest);
            },
            onSettled: () => {
              queryClient.invalidateQueries({
                queryKey: ["kiosk-items", kioskOwnerCaps[0].kioskId],
              });
              queryClient.invalidateQueries({
                queryKey: ["all-listed-vaults"],
              });
            },
            onError: (error) => {
              toaster.create({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to delist vault",
                type: "error",
                duration: 4000,
                closable: true,
              });
              reject(error);
            },
          },
        );
      });
    },
    ...options?.options,
  });
}

export function useGetKiosk({
  payload: kioskId,
  options,
}: HookProps<
  string,
  QueryHookOptions<KioskData | null>
> = {}): UseQueryResult<KioskData | null> {
  return useQuery({
    queryKey: ["kiosk", kioskId],
    queryFn: async () => {
      if (!kioskId) return null;

      try {
        const kiosk = await kioskClient.getKiosk({
          id: kioskId,
          options: {
            withListingPrices: true,
            withKioskFields: true,
          },
        });

        if (!kiosk) return null;

        return kiosk;
      } catch (error) {
        console.error("Error fetching kiosk:", error);
        throw error;
      }
    },
    enabled: !!kioskId,
    ...options,
  });
}

export function useGetOwnedKiosks({
  payload: ownerAddress,
  options,
}: HookProps<
  string,
  QueryHookOptions<OwnedKiosks>
> = {}): UseQueryResult<OwnedKiosks> {
  return useQuery({
    queryKey: ["owned-kiosks", ownerAddress],
    queryFn: async () => {
      if (!ownerAddress) {
        return {
          kioskOwnerCaps: [],
          kioskIds: [],
          hasNextPage: false,
          nextCursor: null,
        } as OwnedKiosks;
      }

      try {
        const kiosks = await kioskClient.getOwnedKiosks({
          address: ownerAddress,
        });

        return kiosks;
      } catch (error) {
        console.error("Error fetching owned kiosks:", error);
        throw error;
      }
    },
    enabled: !!ownerAddress,
    ...options,
  });
}

export interface ListedVaultItem {
  kioskId: string;
  itemId: string;
  type: string;
  price: bigint;
  isListed: boolean;
  timestampMs: number;
}

export function useGetAllListedVaults({
  options,
}: HookProps<void, QueryHookOptions<ListedVaultItem[]>> = {}): UseQueryResult<
  ListedVaultItem[]
> {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["all-listed-vaults"],
    queryFn: async () => {
      try {
        const vaultType = `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`;

        const eventTypes = {
          listed: `0x2::kiosk::ItemListed<${vaultType}>`,
          delisted: `0x2::kiosk::ItemDelisted<${vaultType}>`,
          purchased: `0x2::kiosk::ItemPurchased<${vaultType}>`,
        };

        const [listedEvents, delistedEvents, purchasedEvents] =
          await Promise.all([
            suiClient.queryEvents({
              query: { MoveEventType: eventTypes.listed },
              limit: 1000,
              order: "descending",
            }),
            suiClient.queryEvents({
              query: { MoveEventType: eventTypes.delisted },
              limit: 1000,
              order: "descending",
            }),
            suiClient.queryEvents({
              query: { MoveEventType: eventTypes.purchased },
              limit: 1000,
              order: "descending",
            }),
          ]);

        const allEvents = [
          ...listedEvents.data.map((e) => ({ ...e, type: "LISTED" })),
          ...delistedEvents.data.map((e) => ({ ...e, type: "DELISTED" })),
          ...purchasedEvents.data.map((e) => ({ ...e, type: "PURCHASED" })),
        ].sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs));

        const activeItems: ListedVaultItem[] = [];
        const processedItems = new Set<string>();

        for (const event of allEvents) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsedJson = event.parsedJson as any;

          const kioskId = parsedJson?.kiosk;
          const itemId = parsedJson?.id;

          if (!kioskId || !itemId) continue;

          const uniqueKey = `${kioskId}-${itemId}`;

          if (processedItems.has(uniqueKey)) {
            continue;
          }

          processedItems.add(uniqueKey);

          if (event.type === "LISTED") {
            activeItems.push({
              kioskId: kioskId,
              itemId: itemId,
              type: vaultType,
              price: BigInt(parsedJson.price || 0),
              isListed: true,
              timestampMs: Number(event.timestampMs),
            });
          }
        }

        console.log("Active listed vaults:", activeItems);
        return activeItems;
      } catch (error) {
        console.error("Error fetching listed vaults:", error);
        throw error;
      }
    },
    ...options,
  });
}
