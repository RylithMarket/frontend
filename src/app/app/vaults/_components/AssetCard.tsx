import { TagProps } from "@/components/ui/tag";
import { SUI_EXPLORER_URL } from "@/constants";
import { VaultPosition } from "@/hooks/use-rylith-api";
import { formatAddress, formatType } from "@/libs/formats";
import { formatUsdValue } from "@/libs/formatNumber";
import {
  HStack,
  Link,
  StackProps,
  TagRoot,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useWithdrawAsset } from "@/hooks/use-core-contracts";
import { useParams } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";

interface Props extends StackProps {
  asset: VaultPosition;
  ownerAddress: string;
}
export function AssetCard({ asset, ownerAddress, ...props }: Props) {
  const withdrawMutation = useWithdrawAsset();
  const params = useParams();
  const vaultId = params.id as string;

  const handleWithdraw = () => {
    if (!asset.assetName) {
      return;
    }

    withdrawMutation.mutate({
      vaultId,
      assetName: asset.assetName,
      assetType: asset.type,
      ownerAddress,
    });
  };

  return (
    <HStack w={"full"} align={"start"} {...props}>
      <VStack w={"full"} align={"start"}>
        <Link
          href={`${SUI_EXPLORER_URL}/object/${asset.objectId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatAddress(asset.objectId)}
        </Link>
        <Tooltip content={asset.type}>
          <Text fontSize={"xs"} color={"fg.subtle"} cursor={"pointer"}>
            {formatType(asset.type)}
          </Text>
        </Tooltip>
        <ProtocolTag protocol={asset.protocol} />
      </VStack>
      <VStack align={"end"}>
        <Text fontWeight={"semibold"}>{formatUsdValue(asset.valueUsd)}</Text>
        <Button
          colorPalette={"primary"}
          onClick={handleWithdraw}
          loading={withdrawMutation.isPending}
          disabled={withdrawMutation.isPending || !asset.assetName}
          size={"sm"}
        >
          Withdraw
        </Button>
      </VStack>
    </HStack>
  );
}

interface ProtocolTagProps extends TagProps {
  protocol: "Cetus" | "Native coin" | string;
}
export function ProtocolTag({ protocol, ...props }: ProtocolTagProps) {
  const bg = useMemo(() => {
    switch (protocol) {
      case "Cetus":
        return "#5FF7D7/25";
      case "Native Coin":
        return "#6AAFFB/25";
      default:
        return "gray.100";
    }
  }, [protocol]);

  const color = useMemo(() => {
    switch (protocol) {
      case "Cetus":
        return "#5FF7D7";
      case "Native Coin":
        return "#6AAFFB";
      default:
        return "gray.800";
    }
  }, [protocol]);

  return (
    <TagRoot
      px={"2"}
      py={"1"}
      rounded={"full"}
      size={"sm"}
      bg={bg}
      color={color}
      {...props}
    >
      {protocol}
    </TagRoot>
  );
}
