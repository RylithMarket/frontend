"use client";

import { Button } from "@/components/ui/button";
import {
  chakra,
  Heading,
  HStack,
  HTMLChakraProps,
  Span,
  Text,
  VStack,
} from "@chakra-ui/react";

interface Props extends HTMLChakraProps<"section"> {}
export function HeroSection(props: Props) {
  return (
    <chakra.section w="full" h={"full"} px={"8"} py={"8"} pt={"16"} id="hero-section" {...props}>
      <VStack w={"full"} h={"full"} gap={"4"}>
        <VStack flex={1} gap={"6"}>
          <Heading
            as="h1"
            fontSize={["6xl", "7xl", "8xl"]}
            lineHeight={["5rem", "6rem", "7rem"]}
            fontWeight="extrabold"
            textAlign="center"
            maxW={"10ch"}
            mx="auto"
          >
            Liquid Strategy Marketplace
          </Heading>
          <Text fontSize={["md", "md", "lg"]} textAlign="center" maxW={"48ch"}>
            Trade live DeFi strategies without unwinding or losing time-based
            rewards
          </Text>
          <Button variant={"surface"}>Get Started</Button>
        </VStack>
        <HStack w="full" align={"center"}>
          <Heading
            as="h2"
            fontSize={["3xl", "4xl"]}
            lineHeight={["2.5rem", "3rem"]}
            fontWeight="normal"
            textAlign={"left"}
          >
            Make Strategies
            <br />
            <Span fontWeight={"extrabold"}>Liquid & Tradable</Span>
          </Heading>
        </HStack>
      </VStack>
    </chakra.section>
  );
}
