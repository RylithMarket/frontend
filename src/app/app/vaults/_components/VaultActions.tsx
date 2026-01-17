"use client";

import { VaultData } from "@/hooks/use-rylith-api";
import {
  useListVault,
  useDelistVault,
  useGetAllListedVaults,
} from "@/hooks/use-marketplace";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { HStack } from "@chakra-ui/react";
import { DepositLinkButton } from "./DepositLinkButton";

interface Props {
  vault: VaultData;
}

export function VaultActions({ vault }: Props) {
  const listMutation = useListVault();
  const delistMutation = useDelistVault();
  const { data: listedVaults = [] } = useGetAllListedVaults();

  const isListed = listedVaults.some((item) => item.itemId === vault.id);

  const handleList = () => {
    listMutation.mutate({
      vaultId: vault.id,
      price: BigInt(1),
    });
  };

  const handleDelist = () => {
    delistMutation.mutate({
      itemId: vault.id,
    });
  };

  return (
    <HStack w={"full"} justify={"center"} gap={3}>
      {isListed ? (
        <Button
          variant={"outline"}
          onClick={handleDelist}
          loading={delistMutation.isPending}
          disabled={delistMutation.isPending}
        >
          Delist
        </Button>
      ) : (
        <Button
          onClick={handleList}
          loading={listMutation.isPending}
          disabled={listMutation.isPending}
        >
          List
        </Button>
      )}
      <DepositLinkButton />
    </HStack>
  );
}
