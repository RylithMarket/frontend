"use client";

import { useGetVaultById } from "@/hooks/use-rylith-api";
import { HStack} from "@chakra-ui/react";
import { VaultDetail } from "./VaultDetail";
import { VaultPreview } from "./VaultPreview";
import { useParams } from "next/navigation";

export function VaultAssetsContent() {
  const params = useParams();
  const vaultId = params.id as string;
  const { data: vault, isLoading } = useGetVaultById({
    payload: { vaultId },
  });

  return (
    <HStack w={"full"} h={"full"} gap={"8"} align={"start"}>
      <VaultDetail vaultId={vaultId} />
      <VaultPreview vault={vault!} isLoading={isLoading} />
    </HStack>
  );
}
