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
        <Text fontSize={"lg"} fontWeight={"bold"} color={"error.fg"}>
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
      templateColumns="repeat(auto-fit, minmax(min(100%, 350px), 1fr))"
      gap={["4", "5", "6"]}
      autoRows="max-content"
      {...props}
    >
      {isVaultLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} w={"full"} h={"120px"} borderRadius={"2xl"} />
          ))
        : vaults?.map((vault) => <VaultCard key={vault.id} vault={vault} />)}
    </Grid>
  );
}
