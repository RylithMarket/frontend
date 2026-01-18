"use client";

import { Favicon } from "@/components/brands";
import { ROOT_DOMAIN } from "@/constants";
import {
  chakra,
  Flex,
  For,
  HStack,
  HTMLChakraProps,
  Link,
  LinkOverlay,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { ConnectWallet } from "./ConnectWallet";

const Logo = (props: StackProps) => {
  const homeUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${ROOT_DOMAIN}`
      : "/";

  return (
    <LinkOverlay href={homeUrl}>
      <HStack {...props}>
        <Favicon />
        <Text fontSize="lg" fontWeight="bold" textTransform="uppercase">
          Rylith Market
        </Text>
      </HStack>
    </LinkOverlay>
  );
};

const Navigation = (props: StackProps) => {
  const items = [
    { label: "Docs", href: "/" },
    { label: "Pitch", href: "/pitch" },
  ];

  return (
    <HStack align={"center"} justify={"space-between"} {...props}>
      <For each={items}>
        {(item) => (
          <Link key={item.label} href={item.href} fontSize="md">
            {item.label}
          </Link>
        )}
      </For>
    </HStack>
  );
};
interface HeaderProps extends HTMLChakraProps<"header"> {}
export function Header(props: HeaderProps) {
  return (
    <chakra.header w="full" px="8" py="4" pos={"fixed"} {...props}>
      <HStack w="full">
        <Flex flex={1}>
          <Logo />
        </Flex>
        <Flex flex={1} justifyContent="center">
          <Navigation />
        </Flex>
        <Flex flex={1} justifyContent="flex-end">
          <ConnectWallet />
        </Flex>
      </HStack>
    </chakra.header>
  );
}
