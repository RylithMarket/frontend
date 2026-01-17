"use client";

import { useGetVaultById } from "@/hooks/use-rylith-api";
import { HStack, VStack } from "@chakra-ui/react";
import { ListVaultForm } from "./ListVaultForm";
import { VaultPreview } from "./VaultPreview";
import { useParams } from "next/navigation";

export function VaultListContent() {
  const params = useParams();
  const vaultId = params.id as string;
  const { data: vault, isLoading } = useGetVaultById({
    payload: { vaultId },
  });

  return (
    <HStack w={"full"} h={"full"} gap={"8"} align={"start"}>
      <VStack w={["full", "full", "400px"]} gap={6}>
        <ListVaultForm vaultId={vaultId} />
      </VStack>
      <VaultPreview vault={vault!} isLoading={isLoading} />
    </HStack>
  );
}
