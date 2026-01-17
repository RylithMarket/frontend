"use client";

import { UserObject } from "@/hooks/use-sui";
import { formatAddress } from "@/libs/formats";
import { formatUsdValue } from "@/libs/formatNumber";
import { HStack, Link, StackProps, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useDepositAsset } from "@/hooks/use-core-contracts";
import { SUI_EXPLORER_URL } from "@/constants";

interface Props extends StackProps {
  object: UserObject;
  vaultId: string;
}

export function UserObjectCard({ object, vaultId, ...props }: Props) {
  const depositMutation = useDepositAsset();

  const handleDeposit = () => {
    depositMutation.mutate({
      vaultId,
      assetId: object.objectId,
      assetName: object.data?.type || "",
      assetType: object.data?.type || "",
    });
  };

  const displayType = object.data?.type || "Unknown Type";
  const displayValue = 0; // TODO: Calculate value from object data

  return (
    <HStack w={"full"} align={"start"} {...props}>
      <VStack w={"full"} align={"start"}>
        <Link
          href={`${SUI_EXPLORER_URL}/object/${object.objectId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatAddress(object.objectId)}
        </Link>
        <Text fontSize={"sm"} color={"fg.subtle"}>
          {displayType}
        </Text>
      </VStack>
      <VStack align={"end"}>
        <Text fontWeight={"semibold"}>{formatUsdValue(displayValue)}</Text>
        <Button
          colorPalette={"primary"}
          onClick={handleDeposit}
          loading={depositMutation.isPending}
          disabled={depositMutation.isPending}
          size={"sm"}
        >
          Deposit
        </Button>
      </VStack>
    </HStack>
  );
}
