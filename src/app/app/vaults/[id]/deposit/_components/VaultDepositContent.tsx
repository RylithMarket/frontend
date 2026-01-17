"use client";

import { useGetVaultById } from "@/hooks/use-rylith-api";
import { HStack, VStack } from "@chakra-ui/react";
import { DepositForm } from "./DepositForm";
import { VaultPreview } from "../../../_components/VaultPreview";
import { useParams } from "next/navigation";

export function VaultDepositContent() {
  const params = useParams();
  const vaultId = params.id as string;
  const { data: vault, isLoading } = useGetVaultById({
    payload: { vaultId },
  });

  return (
    <HStack w={"full"} h={"full"} gap={"8"} align={"start"}>
      <VStack w={["full", "full", "400px"]} h={"full"} gap={6}>
        <DepositForm vaultId={vaultId} />
      </VStack>
      <VaultPreview vault={vault!} isLoading={isLoading} />
    </HStack>
  );
}
