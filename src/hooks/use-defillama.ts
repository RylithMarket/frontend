import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { HookProps, QueryHookOptions } from "./types";
import {
  CurrentPriceResponse,
  defiLlamaService,
} from "@/utils/defillamaService";

interface GetCurrentPricesParams {
  coins: string;
  searchWidth?: string;
}

export function useGetCurrentPrices({
  payload: { coins, searchWidth } = { coins: "" },
  options,
}: HookProps<
  GetCurrentPricesParams,
  QueryHookOptions<CurrentPriceResponse, Error>
> = {}): UseQueryResult<CurrentPriceResponse> {
  return useQuery({
    queryKey: ["current-prices", coins, searchWidth],
    queryFn: async () => {
      const response = await defiLlamaService.getCurrentPrices({
        coins,
        searchWidth,
      });
      if (!response) throw new Error("Failed to fetch current prices");
      return response;
    },
    enabled: !!coins,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
}
