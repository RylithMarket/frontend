import { Center, Flex, HStack } from "@chakra-ui/react";
import { Navbar } from "./_components/Navbar";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <HStack
      w={"full"}
      h={"full"}
      gap={0}
      flexDir={["column", "column", "row"]}
      bgImage={
        "radial-gradient(137.62% 100% at 50.8% 100%, #000000 66.92%, rgba(17, 14, 150, 0.75) 80.77%, rgba(59, 48, 248, 0.75) 93.48%, rgba(97, 88, 254, 0.75) 100%)"
      }
    >
      <Center
        flex={[1, 1, 0]}
        h={["auto", "auto", "full"]}
        w={["full", "full", "auto"]}
        px={["4", "8", "8"]}
        py={["2", "4", "0"]}
        borderBottom={["1px solid", "1px solid", "none"]}
        borderColor={["fg.subtle/20", "fg.subtle/20", "transparent"]}
      >
        <Navbar />
      </Center>
      <Flex
        flex={1}
        w={"full"}
        h={["auto", "auto", "full"]}
        pt={["4", "4", "16"]}
      >
        {props.children}
      </Flex>
    </HStack>
  );
}
