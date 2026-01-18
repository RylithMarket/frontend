"use client";

import { UserObject } from "@/hooks/use-sui";
import { formatAddress, formatType } from "@/libs/formats";
import { HStack, Link, StackProps, Text, VStack, Icon } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useDepositAsset } from "@/hooks/use-core-contracts";
import { SUI_EXPLORER_URL } from "@/constants";
import { Tooltip } from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";

const MotionButton = motion.create(Button);

interface Props extends StackProps {
  nft: UserObject;
  vaultId: string;
}

export function AssetNFTCard({ nft, vaultId, ...props }: Props) {
  const [isDepositHovered, setIsDepositHovered] = useState(false);
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
      <MotionButton
        colorPalette={"primary"}
        onClick={handleDeposit}
        loading={depositMutation.isPending}
        disabled={depositMutation.isPending}
        size={"sm"}
        width="100%"
        padding={isDepositHovered ? undefined : "0"}
        justifyContent="center"
        overflow="hidden"
        onHoverStart={() => setIsDepositHovered(true)}
        onHoverEnd={() => setIsDepositHovered(false)}
        animate={{
          width: isDepositHovered ? "80px" : "28px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        style={{ flexShrink: 0 }}
      >
        <motion.div
          animate={{
            opacity: isDepositHovered ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          style={{
            display: isDepositHovered ? "block" : "none",
            whiteSpace: "nowrap",
          }}
        >
          Deposit
        </motion.div>
        <motion.div
          animate={{
            opacity: isDepositHovered ? 0 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          style={{
            display: isDepositHovered ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon as={AiOutlinePlus} />
        </motion.div>
      </MotionButton>
    </HStack>
  );
}
