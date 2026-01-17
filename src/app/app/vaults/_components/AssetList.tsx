"use client";

import { VaultData } from "@/hooks/use-rylith-api";
import { Skeleton, StackProps, Text, VStack } from "@chakra-ui/react";
import { AssetCard } from "./AssetCard";

interface Props extends StackProps {
  vault: VaultData;
  isLoading?: boolean;
  error?: Error | null;
}

export function AssetList({
  vault,
  isLoading = false,
  error,
  ...props
}: Props) {
  const positions = vault?.positions || [];

  if (error) {
    return (
      <VStack w={"full"} gap={4} align={"stretch"} {...props}>
        <Text fontSize={"lg"} fontWeight={"bold"} color={"error.fg"}>
          Error loading assets
        </Text>
        <Text fontSize={"sm"} color={"fg.muted"}>
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </VStack>
    );
  }

  if (!isLoading && !positions?.length) {
    return (
      <VStack w={"full"} gap={4} align={"stretch"} {...props}>
        <Text color={"fg.muted"}>No assets found</Text>
      </VStack>
    );
  }

  return (
    <VStack w={"full"} gap={"8"} {...props}>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} w={"full"} h={"80px"} borderRadius={"md"} />
          ))
        : positions?.map((asset) => (
            <AssetCard 
              key={asset.objectId} 
              asset={asset}
              ownerAddress={vault.owner}
            />
          ))}
    </VStack>
  );
}
