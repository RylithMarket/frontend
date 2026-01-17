import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { rylithApi } from "@/utils/rylithApi";
import { suiClient } from "@/utils/suiClient";
import { HookProps, QueryHookOptions } from "./types";

const API_ROUTES = {
  VAULTS: "/vaults",
  VAULT_BY_ID: (id: string) => `/vaults/${id}`,
  VAULT_STATS: "/vaults/stats",
};

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}

interface VaultPosition {
  objectId: string;
  type: string;
  protocol: string;
  valueUsd: number;
  assetName?: string;
}

interface VaultHistory {
  id: number;
  vaultId: string;
  tvl: string;
  apy: string;
  timestamp: string;
}

interface VaultData {
  id: string;
  owner: string;
  name: string;
  description: string | null;
  strategyType: string;
  imgUrl: string | null;
  tvl: number;
  apy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  history: VaultHistory[];
  positions: VaultPosition[];
}

interface GetVaultsParams {
  owner?: string;
  skip?: number;
  take?: number;
}

export function useGetVaultById({
  payload: { vaultId } = {},
  options,
}: HookProps<
  { vaultId?: string },
  QueryHookOptions<VaultData, Error>
> = {}): UseQueryResult<VaultData> {
  return useQuery({
    queryKey: ["vault", vaultId],
    queryFn: async () => {
      if (!vaultId) throw new Error("Vault ID is required");

      const response = await rylithApi.get<VaultData>(
        API_ROUTES.VAULT_BY_ID(vaultId),
      );
      let vault = response.data;

      try {
        const [suiObject, dynamicFieldsRes] = await Promise.all([
          suiClient.getObject({
            id: vaultId,
            options: {
              showContent: true,
              showType: true,
            },
          }),
          suiClient.getDynamicFields({
            parentId: vaultId,
          }),
        ]);

        if (suiObject?.data?.content && "fields" in suiObject.data.content) {
          const fields = suiObject.data.content.fields as Record<
            string,
            unknown
          >;
          vault = {
            ...vault,
            owner: (fields.owner as string) || vault.owner,
            name: (fields.name as string) || vault.name,
            description: (fields.description as string) || vault.description,
          };
        }

        if (dynamicFieldsRes?.data && vault.positions) {
          const dynamicFieldMap = new Map<string, string>();

          for (const field of dynamicFieldsRes.data) {
            if (
              field.name &&
              typeof field.name.value === "object" &&
              field.name.value !== null &&
              "name" in field.name.value
            ) {
              const keyName = (
                field.name.value as Record<string, unknown>
              ).name as string;
              const objectId = field.objectId;

              if (keyName && objectId) {
                dynamicFieldMap.set(objectId, keyName);
              }
            }
          }

          vault.positions = vault.positions.map((pos) => ({
            ...pos,
            assetName: dynamicFieldMap.get(pos.objectId) || pos.protocol,
          }));
        }
      } catch (error) {
        console.error("Error fetching vault data from Sui:", error);
      }

      return vault;
    },
    enabled: !!vaultId,
    ...options,
  });
}

export function useGetVaults({
  payload: { skip = 0, take = 10 } = {},
  options,
}: HookProps<
  { skip?: number; take?: number },
  QueryHookOptions<VaultData[], Error>
> = {}): UseQueryResult<VaultData[]> {
  return useQuery({
    queryKey: ["vaults", skip, take],
    queryFn: async () => {
      const response = await rylithApi.get<ApiResponse<VaultData[]>>(
        `${API_ROUTES.VAULTS}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
          params: {
            skip,
            take,
          },
        },
      );
      const vaults = response.data.data;

      if (vaults.length > 0) {
        try {
          const vaultIds = vaults.map((v) => v.id);
          const objects = await suiClient.multiGetObjects({
            ids: vaultIds,
            options: {
              showContent: true,
              showType: true,
            },
          });

          return vaults.map((vault, index) => {
            const suiObject = objects[index];
            if (
              suiObject?.data?.content &&
              "fields" in suiObject.data.content
            ) {
              const fields = suiObject.data.content.fields as Record<
                string,
                unknown
              >;
              return {
                ...vault,
                owner: (fields.owner as string) || vault.owner,
                name: (fields.name as string) || vault.name,
                description:
                  (fields.description as string) || vault.description,
              };
            }
            return vault;
          });
        } catch (error) {
          console.error("Error fetching vault objects from Sui:", error);
          return vaults;
        }
      }

      return vaults;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useGetVaultsByOwner({
  payload: { owner, skip = 0, take = 10 } = {},
  options,
}: HookProps<
  { owner?: string; skip?: number; take?: number },
  QueryHookOptions<VaultData[], Error>
> = {}): UseQueryResult<VaultData[]> {
  return useQuery({
    queryKey: ["vaults-by-owner", owner, skip, take],
    queryFn: async () => {
      if (!owner) throw new Error("Owner address is required");

      const response = await rylithApi.get<ApiResponse<VaultData[]>>(
        `${API_ROUTES.VAULTS}`,
        {
          params: {
            owner,
            skip,
            take,
          },
        },
      );
      const vaults = response.data.data;

      if (vaults.length > 0) {
        try {
          const vaultIds = vaults.map((v) => v.id);
          const objects = await suiClient.multiGetObjects({
            ids: vaultIds,
            options: {
              showContent: true,
              showType: true,
            },
          });

          return vaults.map((vault, index) => {
            const suiObject = objects[index];
            if (
              suiObject?.data?.content &&
              "fields" in suiObject.data.content
            ) {
              const fields = suiObject.data.content.fields as Record<
                string,
                unknown
              >;
              return {
                ...vault,
                owner: (fields.owner as string) || vault.owner,
                name: (fields.name as string) || vault.name,
                description:
                  (fields.description as string) || vault.description,
              };
            }
            return vault;
          });
        } catch (error) {
          console.error("Error fetching vault objects from Sui:", error);
          return vaults;
        }
      }

      return vaults;
    },
    enabled: !!owner,
    ...options,
  });
}

export function useGetVaultStats({
  options,
}: HookProps<
  void,
  QueryHookOptions<{ totalVaults: number; totalTvl: number }, Error>
> = {}): UseQueryResult<{
  totalVaults: number;
  totalTvl: number;
}> {
  return useQuery({
    queryKey: ["vault-stats"],
    queryFn: async () => {
      const response = await rylithApi.get<
        ApiResponse<{ totalVaults: number; totalTvl: number }>
      >(API_ROUTES.VAULT_STATS);
      return response.data.data;
    },
    ...options,
  });
}

interface VaultStats {
  vaultId: string;
  tvl: string;
  strategiesCount: number;
  imageUrl: string;
}

export type {
  VaultData,
  VaultPosition,
  VaultHistory,
  VaultStats,
  ApiResponse,
  Pagination,
};
