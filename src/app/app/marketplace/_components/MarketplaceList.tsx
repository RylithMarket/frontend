"use client";

import { useGetAllListedVaults } from "@/hooks/use-marketplace";
import { Grid, GridProps, Skeleton, Text, VStack } from "@chakra-ui/react";
import { ListedVaultCard } from "./ListedVaultCard";

interface Props extends GridProps {}
export function MarketplaceList(props: Props) {
  const {
    data: listedVaults = [],
    isLoading,
    error,
  } = useGetAllListedVaults();

  if (error) {
    return (
      <VStack w={"full"} h={"full"} justify={"center"} align={"center"} gap={4}>
        <Text fontSize={"lg"} fontWeight={"bold"} color={"red.500"}>
          Error loading marketplace
        </Text>
        <Text fontSize={"sm"} color={"fg.muted"}>
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </VStack>
    );
  }

  if (!isLoading && !listedVaults?.length) {
    return (
      <VStack w={"full"} h={"full"} justify={"center"} align={"center"}>
        <Text color={"fg.muted"}>No listed vaults found</Text>
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
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} w={"100%"} h={"120px"} borderRadius={"2xl"} />
          ))
        : listedVaults?.map((listing, index) => (
            <ListedVaultCard key={index} listing={listing} />
          ))}
    </Grid>
  );
}
