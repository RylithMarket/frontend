"use client";

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  chakra,
  Heading,
  HStack,
  HTMLChakraProps,
  Span,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import Link from "next/link";

interface Props extends HTMLChakraProps<"section"> {}
export function HeroSection(props: Props) {
  return (
    <chakra.section
      w="full"
      h={"full"}
      px={"8"}
      py={"8"}
      pt={"16"}
      id="hero-section"
      {...props}
    >
      <VStack w={"full"} h={"full"} gap={"4"}>
        <VStack flex={1} gap={"6"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Text
              fontSize={["md", "md", "lg"]}
              textAlign="center"
              maxW={"48ch"}
            >
              Trade live DeFi strategies without unwinding or losing time-based
              rewards
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <LinkButton variant={"surface"} px={"4"} asChild>
              <Link href={"/app"}>Get Started</Link>
            </LinkButton>
          </motion.div>
        </VStack>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
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
        </motion.div>
      </VStack>
    </chakra.section>
  );
}
