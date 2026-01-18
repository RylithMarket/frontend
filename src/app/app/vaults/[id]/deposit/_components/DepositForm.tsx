"use client";

import { useGetUserCoins, useGetUserNFTs } from "@/hooks/use-sui";
import {
  Text,
  VStack,
  Skeleton,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@chakra-ui/react";
import { AssetCoinCard } from "./AssetCoinCard";
import { AssetNFTCard } from "./AssetNFTCard";

interface Props {
  vaultId: string;
}

export function DepositForm({ vaultId }: Props) {
  const {
    data: coins = [],
    isLoading: coinsLoading,
    error: coinsError,
  } = useGetUserCoins();

  const {
    data: nfts = [],
    isLoading: nftsLoading,
    error: nftsError,
  } = useGetUserNFTs();

  const error = coinsError || nftsError;

  if (error) {
    return (
      <VStack w={"full"} gap={4} align={"stretch"}>
        <Text fontSize={"lg"} fontWeight={"bold"} color={"error.fg"}>
          Error loading assets
        </Text>
        <Text fontSize={"sm"} color={"fg.muted"}>
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </VStack>
    );
  }

  if (coinsLoading || nftsLoading) {
    return (
      <VStack w={"full"} gap={4} align={"stretch"}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} w={"full"} h={12} borderRadius={"md"} />
        ))}
      </VStack>
    );
  }

  if (coins.length === 0 && nfts.length === 0) {
    return (
      <VStack w={"full"} gap={4} align={"stretch"}>
        <Text color={"fg.muted"}>No NFTs or coins available to deposit</Text>
      </VStack>
    );
  }

  return (
    <TabsRoot
      defaultValue="coins"
      w={"full"}
      h={"full"}
      display={"flex"}
      flexDir={"column"}
    >
      <TabsList>
        <TabsTrigger value="coins" p={"2"}>
          Portfolio ({coins.length})
        </TabsTrigger>
        <TabsTrigger value="nfts" p={"2"}>
          NFTs ({nfts.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="coins"
        overflowY={"auto"}
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        _open={{
          animationName: "fade-in, scale-in",
          animationDuration: "300ms",
        }}
        _closed={{
          animationName: "fade-out, scale-out",
          animationDuration: "120ms",
        }}
      >
        <VStack w={"full"} gap={"4"} pt={"4"}>
          {coinsLoading ? (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} w={"full"} h={12} borderRadius={"md"} />
              ))}
            </>
          ) : coins.length > 0 ? (
            coins.map((coin) => (
              <AssetCoinCard
                key={coin.coinObjectId}
                coin={coin}
                vaultId={vaultId}
              />
            ))
          ) : (
            <Text color={"fg.muted"} fontSize={"sm"} textAlign={"center"}>
              No coins available
            </Text>
          )}
        </VStack>
      </TabsContent>

      <TabsContent
        value="nfts"
        overflowY={"auto"}
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        _open={{
          animationName: "fade-in, scale-in",
          animationDuration: "300ms",
        }}
        _closed={{
          animationName: "fade-out, scale-out",
          animationDuration: "120ms",
        }}
      >
        <VStack w={"full"} gap={"4"} pt={"4"}>
          {nftsLoading ? (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} w={"full"} h={20} borderRadius={"md"} />
              ))}
            </>
          ) : nfts.length > 0 ? (
            nfts.map((nft) => (
              <AssetNFTCard key={nft.objectId} nft={nft} vaultId={vaultId} />
            ))
          ) : (
            <Text color={"fg.muted"} fontSize={"sm"} textAlign={"center"}>
              No NFTs available
            </Text>
          )}
        </VStack>
      </TabsContent>
    </TabsRoot>
  );
}
