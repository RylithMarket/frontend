import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { VAULT_CONTRACT } from "@/constants";
import { HookProps, MutationHooksOptions, QueryHookOptions } from "./types";
import { Transaction } from "@mysten/sui/transactions";

interface CreateVaultPayload {
  name: string;
  description: string;
  strategyType: string;
}

interface DepositAssetPayload {
  vaultId: string;
  assetId: string;
  assetName: string;
  assetType: string;
}

interface WithdrawAssetPayload {
  vaultId: string;
  assetName: string;
}

interface VaultData {
  id: string;
  name: string;
  description: string;
  strategyType: string;
  createdAt: number;
  owner: string;
}

interface AssetInfo {
  name: string;
  type: string;
  exists: boolean;
}

interface BorrowAssetPayload {
  vaultId: string;
  assetName: string;
  assetType: string;
  action?: (tx: Transaction, assetRef: unknown) => void;
}

export function useCreateVault({
  options,
}: HookProps<
  CreateVaultPayload,
  MutationHooksOptions<string, Error, CreateVaultPayload>
> = {}): UseMutationResult<string, Error, CreateVaultPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  return useMutation({
    mutationFn: async (payload: CreateVaultPayload) => {
      if (!currentAccount) {
        throw new Error("No connected wallet");
      }

      const tx = new Transaction();

      const vault = tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::create`,
        arguments: [
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode(payload.name))
          ),
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode(payload.description))
          ),
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode(payload.strategyType))
          ),
          tx.object("0x6"),
        ],
      });

      tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::keep`,
        arguments: [vault],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
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

export function useDepositAsset({
  options,
}: HookProps<
  DepositAssetPayload,
  MutationHooksOptions<string, Error, DepositAssetPayload>
> = {}): UseMutationResult<string, Error, DepositAssetPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (payload: DepositAssetPayload) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::deposit_asset`,
        typeArguments: [payload.assetType],
        arguments: [
          tx.object(payload.vaultId),
          tx.object(payload.assetId),
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode(payload.assetName))
          ),
          tx.object("0x6"),
        ],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
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

export function useWithdrawAsset({
  options,
}: HookProps<
  WithdrawAssetPayload,
  MutationHooksOptions<string, Error, WithdrawAssetPayload>
> = {}): UseMutationResult<string, Error, WithdrawAssetPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (payload: WithdrawAssetPayload) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::withdraw_asset`,
        arguments: [
          tx.object(payload.vaultId),
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode(payload.assetName))
          ),
          tx.object("0x6"),
        ],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
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

export function useDestroyVault({
  options,
}: HookProps<
  string,
  MutationHooksOptions<void, Error, string>
> = {}): UseMutationResult<void, Error, string> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (vaultId: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::destroy`,
        arguments: [tx.object(vaultId)],
      });

      return new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: () => {
              resolve();
            },
            onError: reject,
          }
        );
      });
    },
    ...options?.options,
  });
}

export function useVaultData({
  payload: vaultId,
  options,
}: HookProps<
  string,
  QueryHookOptions<VaultData | null>
> = {}): UseQueryResult<VaultData | null> {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["vault", vaultId],
    queryFn: async () => {
      if (!vaultId) return null;

      try {
        const objRes = await client.getObject({
          id: vaultId,
          options: {
            showContent: true,
            showOwner: true,
          },
        });

        if (!objRes.data) return null;

        const obj = objRes.data;

        if (obj?.content?.dataType === "moveObject") {
          const fields = obj.content.fields as Record<string, unknown>;
          return {
            id: vaultId,
            name: (fields.name as string) || "",
            description: (fields.description as string) || "",
            strategyType: (fields.strategy_type as string) || "",
            createdAt: (fields.created_at as number) || 0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            owner: (obj.owner as any).ObjectOwner || "",
          };
        }

        return null;
      } catch (error) {
        console.error("Error fetching vault data:", error);
        throw error;
      }
    },
    enabled: !!vaultId,
    ...options,
  });
}

export function useHasAsset({
  payload,
  options,
}: HookProps<
  { vaultId: string; assetName: string },
  QueryHookOptions<boolean>
> = {}): UseQueryResult<boolean> {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["vault-asset", payload?.vaultId, payload?.assetName],
    queryFn: async () => {
      if (!payload?.vaultId || !payload?.assetName) return false;

      try {
        const obj = await client.getObject({
          id: payload.vaultId,
          options: {
            showContent: true,
          },
        });

        if (obj.data?.content?.dataType === "moveObject") {
          const fields = obj.data.content.fields as Record<string, unknown>;
          return !!(fields && Object.keys(fields).length > 0);
        }

        return false;
      } catch (error) {
        console.error("Error checking asset:", error);
        return false;
      }
    },
    enabled: !!payload?.vaultId && !!payload?.assetName,
    ...options,
  });
}

export function useVaultsByOwner({
  payload: ownerAddress,
  options,
}: HookProps<string, QueryHookOptions<VaultData[]>> = {}): UseQueryResult<
  VaultData[]
> {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["vaults-by-owner", ownerAddress],
    queryFn: async () => {
      if (!ownerAddress) return [];

      try {
        const result = await client.getOwnedObjects({
          owner: ownerAddress,
          filter: {
            StructType: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::StrategyVault`,
          },
          options: {
            showContent: true,
            showOwner: true,
          },
        });

        const vaults: VaultData[] = [];

        for (const item of result.data) {
          if (
            item.data?.objectId &&
            item.data?.content?.dataType === "moveObject"
          ) {
            const fields = item.data.content.fields as Record<string, unknown>;
            vaults.push({
              id: item.data.objectId,
              name: (fields.name as string) || "",
              description: (fields.description as string) || "",
              strategyType: (fields.strategy_type as string) || "",
              createdAt: (fields.created_at as number) || 0,
              owner: ownerAddress,
            });
          }
        }

        return vaults;
      } catch (error) {
        console.error("Error fetching vaults:", error);
        throw error;
      }
    },
    enabled: !!ownerAddress,
    ...options,
  });
}

export function useBorrowMutAsset({
  options,
}: HookProps<
  BorrowAssetPayload,
  MutationHooksOptions<string, Error, BorrowAssetPayload>
> = {}): UseMutationResult<string, Error, BorrowAssetPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  return useMutation({
    mutationFn: async (payload: BorrowAssetPayload) => {
      if (!currentAccount) {
        throw new Error("No connected account");
      }

      const tx = new Transaction();

      const [assetRef] = tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::borrow_mut_asset`,
        arguments: [
          tx.object(payload.vaultId),
          tx.pure.string(payload.assetName),
        ],
        typeArguments: [payload.assetType],
      });

      if (payload.action) {
        payload.action(tx, assetRef);
      }

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
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

export type {
  CreateVaultPayload,
  DepositAssetPayload,
  WithdrawAssetPayload,
  VaultData,
  AssetInfo,
};
