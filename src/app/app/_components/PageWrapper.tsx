"use client";

import {
  chakra,
  Heading,
  HStack,
  StackProps,
  VStack,
  Text,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import {
  IoChevronBackCircleOutline,
  IoChevronBackOutline,
} from "react-icons/io5";

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
            <PageNavigation />
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

interface NavigateProps extends StackProps {}
export function PageNavigation({ ...props }: NavigateProps) {
  const router = useRouter();
  const pathname = usePathname();

  const canGoBack =
    typeof window !== "undefined" &&
    window.history.length > 1 &&
    pathname !== "/app/vaults";

  return (
    <HStack w={"full"} gap={"4"} {...props}>
      <IconButton
        size={"lg"}
        aria-label="Go back"
        variant={"plain"}
        disabled={!canGoBack}
        border={"1.5px solid"}
        borderColor={"fg.subtle"}
        color={"fg.muted"}
        _hover={{ color: "fg", borderColor: "fg" }}
        onClick={() => router.back()}
      >
        <Icon as={IoChevronBackOutline} />
      </IconButton>
    </HStack>
  );
}
