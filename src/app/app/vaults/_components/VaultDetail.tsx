"use client";

import { useGetVaultById } from "@/hooks/use-rylith-api";
import {
  Box,
  HStack,
  Image,
  Skeleton,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AssetList } from "./AssetList";

interface Props extends StackProps {
  vaultId: string;
}

export function VaultDetail({ vaultId, ...props }: Props) {
  const { data: vault, isLoading } = useGetVaultById({
    payload: { vaultId },
  });

  if (isLoading) {
    return (
      <VStack w={"full"} gap={6} align={"stretch"} {...props}>
        <HStack gap={6} align={"flex-start"}>
          <VStack flex={1} gap={4}>
            <Skeleton w={"100%"} h={"300px"} borderRadius={"lg"} />
            <Skeleton w={"100%"} h={"200px"} borderRadius={"lg"} />
          </VStack>
          <VStack flex={1} gap={4}>
            <Skeleton w={"100%"} h={"80px"} borderRadius={"lg"} />
            <Skeleton w={"100%"} h={"80px"} borderRadius={"lg"} />
            <Skeleton w={"100%"} h={"80px"} borderRadius={"lg"} />
          </VStack>
        </HStack>
        <VStack gap={4}>
          <Skeleton w={"100%"} h={"80px"} borderRadius={"lg"} />
          <Skeleton w={"100%"} h={"80px"} borderRadius={"lg"} />
          <Skeleton w={"100%"} h={"80px"} borderRadius={"lg"} />
        </VStack>
      </VStack>
    );
  }

  if (!vault) {
    return (
      <VStack w={"full"} gap={4} align={"stretch"} {...props}>
        <Text color={"fg.muted"}>Vault not found</Text>
      </VStack>
    );
  }

  return (
    <VStack w={"full"} gap={6} align={"stretch"} {...props}>
      <AssetList vault={vault} isLoading={isLoading} />
    </VStack>
  );
}
