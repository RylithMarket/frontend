import { DEFILLAMA_API_URL } from "@/constants";
import axios from "axios";

interface TokenPrice {
  decimals: number;
  price: number;
  symbol: string;
  timestamp: number;
}

interface CurrentPriceResponse {
  coins: Record<string, TokenPrice>;
}

interface GetCurrentPricesParams {
  coins: string;
  searchWidth?: string;
}

class DefiLlamaService {
  private baseUrl: string;

  constructor(baseUrl: string = DEFILLAMA_API_URL) {
    this.baseUrl = baseUrl;
  }

  private formatCoins(coins: string): string {
    return coins;
  }

  private async request<T>(
    url: string,
    params?: Record<string, string>,
  ): Promise<T | null> {
    try {
      const response = await axios.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error("DefiLlama API request failed:", error);
      return null;
    }
  }

  async getCurrentPrices(
    params: GetCurrentPricesParams,
  ): Promise<CurrentPriceResponse | null> {
    const coins = this.formatCoins(params.coins);
    const url = `${this.baseUrl}/prices/current/${coins}`;
    return this.request<CurrentPriceResponse>(url, {
      searchWidth: params.searchWidth || "6h",
    });
  }
}

export const defiLlamaService = new DefiLlamaService();
export type { CurrentPriceResponse, TokenPrice, GetCurrentPricesParams };
