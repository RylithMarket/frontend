import { Button } from "@/components/ui/button";
import { SUI_EXPLORER_URL } from "@/constants";
import { ListedVaultItem, usePurchaseVault } from "@/hooks/use-marketplace";
import { VaultData, useGetVaultById } from "@/hooks/use-rylith-api";
import { formatUsdValue } from "@/libs/formatNumber";
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

interface Props extends StackProps {
  listing: ListedVaultItem;
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

function Actions({
  vault,
  listing,
  ...props
}: { vault: VaultData; listing: ListedVaultItem } & StackProps) {
  const purchaseMutation = usePurchaseVault();

  const handlePurchase = () => {
    purchaseMutation.mutate(
      {
        itemId: listing.itemId,
        price: listing.price,
        kioskId: listing.kioskId,
      },
      {
        onError: (error) => {
          console.error("Purchase failed:", error);
        },
      },
    );
  };

  return (
    <HStack w={"full"} align={"start"} justify={"start"} {...props}>
      <Button
        onClick={handlePurchase}
        loading={purchaseMutation.isPending}
        disabled={purchaseMutation.isPending}
        size={"sm"}
      >
        Purchase
      </Button>
    </HStack>
  );
}

function Details({
  vault,
  listing,
  ...props
}: { vault: VaultData; listing: ListedVaultItem } & StackProps) {
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
          Price: {formatUsdValue(Number(listing.price) / 1e9)}
        </Text>
      </Flex>
      <Actions vault={vault} listing={listing} />
    </VStack>
  );
}

export function ListedVaultCard({ listing, ...props }: Props) {
  const { data: vault, isLoading } = useGetVaultById({
    payload: { vaultId: listing.itemId },
  });

  if (isLoading || !vault) {
    return (
      <HStack
        bg={"bg.subtle/50"}
        h={"fit"}
        p={"2"}
        rounded={"3xl"}
        gap={"4"}
        align={"center"}
        maxW={"md"}
        w={"full"}
        {...props}
      >
        <Skeleton width={["16", "32"]} height={["16", "32"]} rounded={"3xl"} />
        <VStack w={"full"}>
          <Skeleton h={"6"} w={"full"} />
          <Skeleton h={"4"} w={"3/4"} />
        </VStack>
      </HStack>
    );
  }

  return (
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
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      {...props}
    >
      <VaultImage vault={vault} />
      <Details vault={vault} listing={listing} />
      <LinkOverlay href={`/app/vaults/${vault.id}`} />
    </LinkBox>
  );
}
