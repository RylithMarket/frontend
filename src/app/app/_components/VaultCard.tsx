import { SUI_EXPLORER_URL } from "@/constants";
import { VaultData } from "@/hooks/use-rylith-api";
import { formatAddress } from "@/libs/formats";
import {
  HStack,
  ImageProps,
  StackProps,
  Image,
  VStack,
  Text,
  Link,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import { useState } from "react";

interface Props extends StackProps {
  vault: VaultData;
}

function VaultImage({
  vault,
  ...imageProps
}: { vault: VaultData } & ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <>
      {isLoading && (
        <Skeleton width={["16", "32"]} height={["16", "32"]} rounded={"3xl"} />
      )}
      <Image
        src={vault.imgUrl || `/vaults/${vault.id}/image.png`}
        alt={vault.name}
        width={["16", "32"]}
        height={["16", "32"]}
        rounded={"3xl"}
        onLoad={handleLoadingComplete}
        onError={handleError}
        display={isLoading ? "none" : "block"}
        {...imageProps}
      />
      {hasError && (
        <Flex
          width={["16", "32"]}
          height={["16", "32"]}
          bg={"gray.200"}
          rounded={"3xl"}
          align={"center"}
          justify={"center"}
        >
          <Text fontSize={"xs"} color={"fg.muted"}>
            No image
          </Text>
        </Flex>
      )}
    </>
  );
}

function Details({ vault, ...props }: { vault: VaultData } & StackProps) {
  return (
    <VStack w={"full"} {...props}>
      <Text fontSize={"lg"} fontWeight={"medium"}>
        {vault.name} @
        {
          <Link href={`${SUI_EXPLORER_URL}/object/${vault.id}`}>
            {formatAddress(vault.id)}
          </Link>
        }
      </Text>
      <Flex
        w={"full"}
        pl={"2"}
        borderLeft={"1.5px solid"}
        borderLeftColor={"blue"}
        align={"start"}
        justify={"start"}
      >
        <Text color={"fg.subtle"}>
          {vault.description || "This is a vault on Rylith and it's so cool!"}
        </Text>
      </Flex>
    </VStack>
  );
}

export function VaultCard({ vault, ...props }: Props) {
  return (
    <HStack
      bg={"bg.subtle/50"}
      h={"fit"}
      p={"2"}
      rounded={"3xl"}
      gap={"4"}
      align={"center"}
      {...props}
    >
      <VaultImage vault={vault} />
      <Details vault={vault} />
    </HStack>
  );
}
