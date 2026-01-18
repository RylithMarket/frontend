"use client";

import { UserObject } from "@/hooks/use-sui";
import { formatAddress, formatType } from "@/libs/formats";
import {
  HStack,
  Link,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useDepositAsset } from "@/hooks/use-core-contracts";
import { SUI_EXPLORER_URL } from "@/constants";
import { Tooltip } from "@/components/ui/tooltip";

interface Props extends StackProps {
  nft: UserObject;
  vaultId: string;
}

export function AssetNFTCard({ nft, vaultId, ...props }: Props) {
  const depositMutation = useDepositAsset();

  const handleDeposit = () => {
    depositMutation.mutate({
      vaultId,
      assetId: nft.objectId,
      assetName: nft.type || "",
      assetType: nft.type || "",
    });
  };

  const nftType = nft.type || "Unknown";

  return (
    <HStack w={"full"} align={"start"} gap={"4"} {...props}>
      <VStack w={"full"} align={"start"}>
        <Link
          href={`${SUI_EXPLORER_URL}/object/${nft.objectId}`}
          target="_blank"
          rel="noopener noreferrer"
          fontSize={"sm"}
          fontWeight={"medium"}
        >
          {formatAddress(nft.objectId)}
        </Link>
        <Tooltip content={nftType}>
          <Text fontSize={"xs"} color={"fg.subtle"} cursor={"pointer"}>
            {formatType(nftType)}
          </Text>
        </Tooltip>
      </VStack>
      <Button
        colorPalette={"primary"}
        onClick={handleDeposit}
        loading={depositMutation.isPending}
        disabled={depositMutation.isPending}
        size={"sm"}
        flexShrink={0}
      >
        Deposit
      </Button>
    </HStack>
  );
}
