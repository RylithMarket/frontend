import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { rylithApi } from "@/utils/rylithApi";

const API_ROUTES = {
  VAULTS: "/vaults",
  VAULT_BY_ID: (id: string) => `/vaults/${id}`,
  VAULT_POSITIONS: (id: string) => `/vaults/${id}/positions`,
  VAULT_HISTORY: (id: string) => `/vaults/${id}/history`,
  VAULT_STATS: "/vaults/stats",
};

interface VaultPosition {
  objectId: string;
  type: string;
  protocol: string;
  valueUsd: number;
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
  vaultId,
  enabled = true,
}: {
  vaultId?: string;
  enabled?: boolean;
} = {}): UseQueryResult<VaultData> {
  return useQuery({
    queryKey: ["vault", vaultId],
    queryFn: async () => {
      if (!vaultId) throw new Error("Vault ID is required");
      const response = await rylithApi.get<VaultData>(
        API_ROUTES.VAULT_BY_ID(vaultId)
      );
      return response.data;
    },
    enabled: !!vaultId && enabled,
  });
}

export function useGetVaults({
  owner,
  skip = 0,
  take = 10,
  enabled = true,
}: GetVaultsParams & { enabled?: boolean } = {}): UseQueryResult<VaultData[]> {
  return useQuery({
    queryKey: ["vaults", owner, skip, take],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (owner) params.append("owner", owner);
      params.append("skip", skip.toString());
      params.append("take", take.toString());

      const response = await rylithApi.get<VaultData[]>(
        `${API_ROUTES.VAULTS}?${params}`
      );
      return response.data;
    },
    enabled,
  });
}

export function useGetVaultsByOwner({
  owner,
  skip = 0,
  take = 10,
  enabled = true,
}: {
  owner?: string;
  skip?: number;
  take?: number;
  enabled?: boolean;
} = {}): UseQueryResult<VaultData[]> {
  return useQuery({
    queryKey: ["vaults-by-owner", owner, skip, take],
    queryFn: async () => {
      if (!owner) throw new Error("Owner address is required");

      const params = new URLSearchParams();
      params.append("owner", owner);
      params.append("skip", skip.toString());
      params.append("take", take.toString());

      const response = await rylithApi.get<VaultData[]>(
        `${API_ROUTES.VAULTS}?${params}`
      );
      return response.data;
    },
    enabled: !!owner && enabled,
  });
}

export function useGetVaultPositions({
  vaultId,
  enabled = true,
}: {
  vaultId?: string;
  enabled?: boolean;
} = {}): UseQueryResult<VaultPosition[]> {
  return useQuery({
    queryKey: ["vault-positions", vaultId],
    queryFn: async () => {
      if (!vaultId) throw new Error("Vault ID is required");
      const response = await rylithApi.get<VaultPosition[]>(
        API_ROUTES.VAULT_POSITIONS(vaultId)
      );
      return response.data;
    },
    enabled: !!vaultId && enabled,
  });
}

export function useGetVaultHistory({
  vaultId,
  skip = 0,
  take = 30,
  enabled = true,
}: {
  vaultId?: string;
  skip?: number;
  take?: number;
  enabled?: boolean;
} = {}): UseQueryResult<VaultHistory[]> {
  return useQuery({
    queryKey: ["vault-history", vaultId, skip, take],
    queryFn: async () => {
      if (!vaultId) throw new Error("Vault ID is required");

      const params = new URLSearchParams();
      params.append("skip", skip.toString());
      params.append("take", take.toString());

      const response = await rylithApi.get<VaultHistory[]>(
        `${API_ROUTES.VAULT_HISTORY(vaultId)}?${params}`
      );
      return response.data;
    },
    enabled: !!vaultId && enabled,
  });
}

export function useGetVaultStats({
  enabled = true,
}: {
  enabled?: boolean;
} = {}): UseQueryResult<{ totalVaults: number; totalTvl: number }> {
  return useQuery({
    queryKey: ["vault-stats"],
    queryFn: async () => {
      const response = await rylithApi.get<{ totalVaults: number; totalTvl: number }>(
        API_ROUTES.VAULT_STATS
      );
      return response.data;
    },
    enabled,
  });
}

export type {
  VaultData,
  VaultPosition,
  VaultHistory,
};
