import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { HookProps, QueryHookOptions } from "./types";

interface BalanceData {
  sui: bigint;
  formatted: string;
}

export function useSuiBalance(
  options?: HookProps<void, QueryHookOptions<BalanceData | null>>
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
