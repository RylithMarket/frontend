"use client";

import { useGetVaults, useGetVaultsByOwner } from "@/hooks/use-rylith-api";
import { Grid, GridProps, Skeleton, Text, VStack } from "@chakra-ui/react";
import { VaultCard } from "../../_components/VaultCard";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface Props extends GridProps {}
export function VaultList(props: Props) {
  const currentAccount = useCurrentAccount();
  const {
    data: vaults,
    isLoading: isVaultLoading,
    error,
    status,
  } = useGetVaultsByOwner({
    payload: {
      owner: currentAccount?.address,
    },
  });

  if (error) {
    return (
      <VStack w={"full"} h={"full"} justify={"center"} align={"center"} gap={4}>
        <Text fontSize={"lg"} fontWeight={"bold"} color={"red.500"}>
          Error loading vaults
        </Text>
        <Text fontSize={"sm"} color={"fg.muted"}>
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </VStack>
    );
  }

  if (!isVaultLoading && !vaults?.length) {
    return (
      <VStack w={"full"} h={"full"} justify={"center"} align={"center"}>
        <Text color={"fg.muted"}>No vaults found</Text>
      </VStack>
    );
  }

  return (
    <Grid
      w={"full"}
      h={"full"}
      templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
      gap={["4", "5", "6"]}
      autoRows="max-content"
      {...props}
    >
      {isVaultLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} w={"100%"} h={"120px"} borderRadius={"2xl"} />
          ))
        : vaults?.map((vault) => <VaultCard key={vault.id} vault={vault} />)}
    </Grid>
  );
}
