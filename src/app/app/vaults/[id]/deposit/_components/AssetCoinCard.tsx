"use client";

import { formatAddress } from "@/libs/formats";
import { formatNumber } from "@/libs/formatNumber";
import {
  HStack,
  Input,
  Link,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useDepositAsset } from "@/hooks/use-core-contracts";
import { SUI_EXPLORER_URL } from "@/constants";
import { CoinMetadata, CoinStruct } from "@mysten/sui/client";
import { useMemo, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props extends StackProps {
  coin: CoinStruct;
  vaultId: string;
}

export function AssetCoinCard({ coin, vaultId, ...props }: Props) {
  const [amount, setAmount] = useState("");
  const depositMutation = useDepositAsset();
  const suiClient = useSuiClient();

  const {
    data: coinMetadata,
    isLoading: isLoadingCoinmetadata,
    error: metadataError,
  } = useQuery<CoinMetadata | null>({
    queryKey: ["coin-metadata", coin.coinType],
    queryFn: async () => {
      return await suiClient.getCoinMetadata({
        coinType: coin.coinType,
      });
    },
    staleTime: Infinity,
    retry: 2,
  });

  const handleDeposit = () => {
    if (!amount || !coinMetadata) return;

    depositMutation.mutate({
      vaultId,
      assetId: coin.coinObjectId,
      assetName: coin.coinType,
      assetType: coin.coinType,
      amount: amount,
      decimals: coinMetadata.decimals,
    });
  };

  const coinType = coin.coinType || "Unknown";
  const coinSymbol = coinType.split("::").pop() || "COIN";
  const coinAddress = coinType.split("::")[0];
  const coinModule = coinType.split("::")[1];

  const balance = useMemo(() => {
    if (!coinMetadata) return "0";
    const divisor = 10 ** coinMetadata.decimals;
    return formatNumber(Number(coin.balance) / divisor, {
      decimals: 2,
      maxDecimals: 6,
    });
  }, [coin.balance, coinMetadata]);

  if (isLoadingCoinmetadata) {
    return <Skeleton width={"full"} height={"64px"} rounded={"md"} />;
  }

  if (metadataError) {
    return (
      <VStack
        w={"full"}
        align={"stretch"}
        gap={2}
        p={3}
        bg={"red.50"}
        borderRadius={"md"}
        border={"1px solid"}
        borderColor={"red.200"}
        {...props}
      >
        <Text fontSize={"sm"} fontWeight={"medium"} color={"red.700"}>
          Failed to load {coinSymbol}
        </Text>
        <Text fontSize={"xs"} color={"red.600"}>
          {metadataError instanceof Error
            ? metadataError.message
            : "Unable to fetch coin metadata"}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack w={"full"} align={"stretch"} gap={2} {...props}>
      <HStack w={"full"} align={["center", "start"]} gap={[2, 3]}>
        <VStack w={"full"} align={"start"} gap={0} flex={1} minW={0}>
          <Link
            href={`${SUI_EXPLORER_URL}/object/${coin.coinObjectId}`}
            target="_blank"
            rel="noopener noreferrer"
            fontSize={["xs", "sm"]}
            truncate
          >
            {coinSymbol}
          </Link>
          <Text fontSize={"xs"} color={"fg.subtle"} truncate>
            {formatAddress(coinAddress)}::{coinModule}::{coinSymbol}
          </Text>
        </VStack>
        <Text fontSize={"xs"} color={"primary"} mt={[0, 1]} flexShrink={0}>
          {balance}
        </Text>
      </HStack>
      <HStack w={"full"} gap={[1, 2]} align={"end"}>
        <Input
          placeholder="Amount"
          variant="subtle"
          px={["1", "2"]}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          flex={1}
          size={["xs", "sm"]}
        />
        <Button
          onClick={handleDeposit}
          loading={depositMutation.isPending}
          disabled={depositMutation.isPending || !amount}
          size={["xs", "sm"]}
          flexShrink={0}
        >
          Deposit
        </Button>
      </HStack>
    </VStack>
  );
}
