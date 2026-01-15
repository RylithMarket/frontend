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
  kioskId: string;
  itemId: string;
}

interface KioskItemDetail {
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
              queryClient.invalidateQueries({ queryKey: ["kiosks"] });
              resolve(result.digest);
            },
            onError: reject,
          }
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
              queryClient.invalidateQueries({
                queryKey: ["kiosk-items", kioskId],
              });
              resolve(result.digest);
            },
            onError: reject,
          }
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
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const queryClient = useQueryClient();

  if (!currentAccount) {
    throw new Error("No connected account");
  }

  return useMutation({
    mutationFn: async (payload: PurchaseVaultPayload) => {
      const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({
        address: currentAccount.address,
      });

      const tx = new Transaction();
      const kioskTx = new KioskTransaction({
        transaction: tx,
        kioskClient,
        cap: kioskOwnerCaps[0],
      });

      await kioskTx.purchaseAndResolve({
        itemType: `${VAULT_CONTRACT.packageId}:${VAULT_CONTRACT.moduleName}::StrategyVault`,
        sellerKiosk: payload.kioskId,
        itemId: payload.itemId,
        price: BigInt(payload.price.toString()),
      });

      kioskTx.finalize();

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              queryClient.invalidateQueries({
                queryKey: ["kiosk-items", payload.kioskId],
              });
              resolve(result.digest);
            },
            onError: reject,
          }
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
              queryClient.invalidateQueries({
                queryKey: ["kiosk-items", payload.kioskId],
              });
              resolve(result.digest);
            },
            onError: reject,
          }
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

interface ListedVaultItem {
  kioskId: string;
  itemId: string;
  type: string;
  price: bigint;
  isListed: boolean;
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
        const eventType = `0x2::kiosk::ItemListed<${vaultType}>`;

        const objects = await suiClient.queryEvents({
          query: {
            MoveEventType: eventType,
          },
          limit: 1000,
        });

        const allListedItems: ListedVaultItem[] = [];

        for (const event of objects.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsedJson = event.parsedJson as any;
          if (parsedJson?.kiosk_id && parsedJson?.item_id) {
            allListedItems.push({
              kioskId: parsedJson.kiosk,
              itemId: parsedJson.item_id,
              type: vaultType,
              price: BigInt(parsedJson.price || 0),
              isListed: true,
            });
          }
        }

        return allListedItems;
      } catch (error) {
        console.error("Error fetching listed vaults:", error);
        throw error;
      }
    },
    ...options,
  });
}
