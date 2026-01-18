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
  Link as ChakraLink,
  Flex,
  Skeleton,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "motion/react";

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
    <VStack w={"full"} align={"start"} {...props}>
      <Text fontSize={"lg"} fontWeight={"medium"}>
        {vault.name} @
        {
          <ChakraLink href={`${SUI_EXPLORER_URL}/object/${vault.id}`}>
            {formatAddress(vault.id)}
          </ChakraLink>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      style={{ width: "100%" }}
    >
      <LinkBox
        as={HStack}
        bg={"bg.subtle/50"}
        h={"fit"}
        p={"2"}
        rounded={"3xl"}
        gap={"4"}
        align={"center"}
        cursor={"pointer"}
        transition={"all 0.2s ease"}
        maxW={"md"}
        w={"full"}
        _hover={{
          bg: "bg.subtle",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        {...props}
      >
        <VaultImage vault={vault} />
        <Details vault={vault} />
        <LinkOverlay href={`/app/vaults/${vault.id}`} />
      </LinkBox>
    </motion.div>
  );
}
