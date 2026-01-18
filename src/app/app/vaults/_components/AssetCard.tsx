"use client";

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
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWithdrawAsset } from "@/hooks/use-core-contracts";
import { useParams } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { CetusActionsPopover } from "./cetus/CetusActionsPopover";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props extends StackProps {
  asset: VaultPosition;
  ownerAddress: string;
}
export function AssetCard({ asset, ownerAddress, ...props }: Props) {
  const [isOpen, setIsOpen] = useState<string | null>(null);
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

  const isCetus = asset.protocol === "Cetus";
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  return (
    <VStack w={"full"} align={"start"} gap={2} {...props}>
      <HStack w={"full"} align={"start"}>
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
        <VStack align={"end"} gap={2}>
          <Text fontWeight={"semibold"}>{formatUsdValue(asset.valueUsd)}</Text>
          <HStack gap={2}>
            <Button
              colorPalette={"primary"}
              onClick={handleWithdraw}
              loading={withdrawMutation.isPending}
              disabled={withdrawMutation.isPending || !asset.assetName}
              size={"sm"}
            >
              Withdraw
            </Button>
            {isCetus && (
              <Button
                variant={"outline"}
                onClick={() =>
                  setExpandedAction(expandedAction ? null : "cetus")
                }
                size={"sm"}
              >
                {expandedAction === "cetus" ? "Hide" : "Actions"}
              </Button>
            )}
          </HStack>
        </VStack>
      </HStack>

      {expandedAction === "cetus" && isCetus && (
        <HStack w={"full"} gap={2} pl={4}>
          <PopoverRoot
            open={isOpen === "add"}
            onOpenChange={(e) => setIsOpen(e.open ? "add" : null)}
          >
            <PopoverTrigger asChild>
              <Button // @todo implement remove liquidity
                disabled={true}
                variant={"outline"}
                size={"sm"}
              >
                Add Liquidity
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <CetusActionsPopover />
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>

          <PopoverRoot
            open={isOpen === "remove"}
            onOpenChange={(e) => setIsOpen(e.open ? "remove" : null)}
          >
            <PopoverTrigger asChild>
              <Button
                // @todo implement remove liquidity
                disabled={true}
                variant={"outline"}
                size={"sm"}
              >
                Remove Liquidity
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <CetusActionsPopover />
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </HStack>
      )}
    </VStack>
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
