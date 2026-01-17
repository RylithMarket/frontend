"use client";

import {
  chakra,
  Heading,
  HStack,
  StackProps,
  VStack,
  Text,
} from "@chakra-ui/react";

interface Props extends StackProps {
  name?: string;
  description?: string;
  toolbar?: React.ReactNode;
}
export function PageWrapper({
  name,
  toolbar,
  description,
  children,
  ...props
}: Props) {
  return (
    <chakra.main w={"full"} h={"full"} p={"8"}>
      <VStack
        w={"full"}
        h={"full"}
        align={"start"}
        justify={"center"}
        gap={"8"}
        {...props}
      >
        <HStack w={"full"} justify={"space-between"}>
          <VStack w={"full"} align={"start"}>
            <Heading
              as="h1"
              fontSize={["4xl", "5xl", "6xl"]}
              lineHeight={["3.5rem", "4.5rem", "5rem"]}
              fontWeight="bold"
            >
              {name}
            </Heading>
            <Text color={"fg.subtle"}>{description}</Text>
          </VStack>
          {toolbar}
        </HStack>
        {children}
      </VStack>
    </chakra.main>
  );
}
