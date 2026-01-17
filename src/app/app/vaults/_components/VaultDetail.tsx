"use client";

import { useGetVaultById } from "@/hooks/use-rylith-api";
import { Skeleton, StackProps, VStack } from "@chakra-ui/react";
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
      <VStack w={"full"} gap={4} align={"stretch"} {...props}>
        <Skeleton h={"100px"} borderRadius={"lg"} />
        <Skeleton h={"100px"} borderRadius={"lg"} />
      </VStack>
    );
  }

  if (!vault) {
    return null;
  }

  return (
    <VStack w={"full"} gap={6} align={"stretch"} {...props}>
      <AssetList vault={vault} isLoading={isLoading} />
    </VStack>
  );
}
