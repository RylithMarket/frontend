"use client";

import { VaultData } from "@/hooks/use-rylith-api";
import { formatAddress } from "@/libs/formats";
import { Image, Skeleton, StackProps, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { VaultActions } from "./VaultActions";

interface Props extends StackProps {
  vault: VaultData;
  isLoading?: boolean;
}

export function VaultPreview({ vault, isLoading = false, ...props }: Props) {
  const [imageLoading, setImageLoading] = useState(true);

  if (isLoading) {
    return (
      <VStack
        flex={1}
        h={"full"}
        gap={6}
        justify={"start"}
        align={"center"}
        {...props}
      >
        <Skeleton
          maxW={"64"}
          w={"full"}
          minW={"sm"}
          maxWidth={"md"}
          aspectRatio={"1 / 1"}
          borderRadius={"3xl"}
        />
        <Skeleton w={"200px"} h={"24px"} />
        <Skeleton w={"300px"} h={"60px"} />
      </VStack>
    );
  }

  return (
    <VStack
      flex={1}
      h={"full"}
      gap={6}
      justify={"start"}
      align={"center"}
      {...props}
    >
      {imageLoading && (
        <Skeleton
          maxW={"64"}
          w={"full"}
          minW={"sm"}
          maxWidth={"md"}
          aspectRatio={"1 / 1"}
          borderRadius={"3xl"}
        />
      )}
      <Image
        src={vault.imgUrl || `/vaults/${vault.id}/image.png`}
        alt={vault.name}
        maxW={"64"}
        w={"full"}
        minW={"sm"}
        maxWidth={"md"}
        aspectRatio={"1 / 1"}
        objectFit={"cover"}
        borderRadius={"3xl"}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageLoading(false);
        }}
        display={imageLoading ? "none" : "block"}
      />

      <VStack align={"center"}>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          {vault.name}
        </Text>
        <Text fontSize={"sm"} color={"fg.subtle"} textAlign={"center"}>
          @{formatAddress(vault.id)}
        </Text>
        <Text fontSize={"sm"} color={"fg.subtle"} lineHeight={"relaxed"}>
          {vault.description || "This is a vault strategy on Rylith platform."}
        </Text>
      </VStack>

      <VaultActions vault={vault} />
    </VStack>
  );
}
