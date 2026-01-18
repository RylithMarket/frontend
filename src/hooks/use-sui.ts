import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { HookProps, QueryHookOptions } from "./types";
import { CoinStruct, SuiObjectData } from "@mysten/sui/client";

interface BalanceData {
  sui: bigint;
  formatted: string;
}

export interface UserObject extends SuiObjectData {
  objectType?: string;
  objectId: string;
  version: string;
  digest: string;
  data?: {
    type: string;
    fields?: Record<string, unknown>;
  };
}

export function useSuiBalance(
  options?: HookProps<void, QueryHookOptions<BalanceData | null>>,
): UseQueryResult<BalanceData | null, Error> {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  return useQuery({
    queryKey: ["sui-balance", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount?.address) return null;

      try {
        const balance = await suiClient.getBalance({
          owner: currentAccount.address,
          coinType: "0x2::sui::SUI",
        });

        const sui = BigInt(balance.totalBalance);
        const formatted = (Number(sui) / 1e9).toFixed(2);

        return {
          sui,
          formatted,
        };
      } catch (error) {
        console.error("Error fetching SUI balance:", error);
        throw error;
      }
    },
    enabled: !!currentAccount?.address,
    refetchInterval: 5000,
    ...options?.options,
  });
}

// Helper function to check if object is a coin
function isCoin(type: string): boolean {
  return type.includes("::coin::Coin") || type.includes("0x2::coin::Coin");
}

export function useGetUserCoins(
  options?: HookProps<void, QueryHookOptions<CoinStruct[]>>,
): UseQueryResult<CoinStruct[], Error> {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  return useQuery({
    queryKey: ["user-coins", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount?.address) return [];

      try {
        const coins: CoinStruct[] = [];
        let cursor: string | null | undefined = undefined;

        do {
          const response = await suiClient.getAllCoins({
            owner: currentAccount.address,
            limit: 50,
            cursor,
          });

          if (response.data) {
            for (const coin of response.data) {
              coins.push(coin);
            }
          }

          cursor = response.nextCursor;
        } while (cursor);

        return coins;
      } catch (error) {
        console.error("Error fetching user coins:", error);
        throw error;
      }
    },
    enabled: !!currentAccount?.address,
    refetchInterval: 10000,
    ...options?.options,
  });
}

export function useGetUserNFTs(
  options?: HookProps<void, QueryHookOptions<SuiObjectData[]>>,
): UseQueryResult<SuiObjectData[], Error> {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  return useQuery({
    queryKey: ["user-nfts", currentAccount?.address],
    queryFn: async () => {
      // 1. Kiểm tra account tồn tại
      if (!currentAccount) return [];

      try {
        const nfts: SuiObjectData[] = [];
        let cursor: string | null | undefined = undefined;
        let hasNextPage = true;
        let pageCount = 0;
        const MAX_PAGES = 10;

        while (hasNextPage && pageCount < MAX_PAGES) {
          const response = await suiClient.getOwnedObjects({
            owner: currentAccount.address,
            filter: {
              MatchNone: [{ StructType: "0x2::coin::Coin" }],
            },
            options: {
              showType: true,
              showContent: true,
              showDisplay: true,
            },
            limit: 50,
            cursor, // Lần đầu là undefined (Sui chấp nhận), các lần sau là string
          });

          // console.log(`Fetched page ${pageCount + 1}`, response);

          if (response.data) {
            for (const obj of response.data) {
              if (obj.data && obj.data.type && !isCoin(obj.data.type)) {
                nfts.push(obj.data);
              }
            }
          }

          cursor = response.nextCursor;
          hasNextPage = response.hasNextPage;
          pageCount++;
        }

        return nfts;
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
        throw error;
      }
    },
    enabled: !!currentAccount?.address,
    staleTime: 60000,
    ...options?.options,
  });
}
