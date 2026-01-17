import { Center, Flex, HStack } from "@chakra-ui/react";
import { Navbar } from "./_components/Navbar";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <HStack
      w={"full"}
      h={"full"}
      gap={0}
      bgImage={
        "radial-gradient(137.62% 100% at 50.8% 100%, #000000 66.92%, rgba(17, 14, 150, 0.75) 80.77%, rgba(59, 48, 248, 0.75) 93.48%, rgba(97, 88, 254, 0.75) 100%)"
      }
    >
      <Center flex={0} h={"full"} px={"8"}>
        <Navbar />
      </Center>
      <Flex flex={1} w={"full"} h={"full"} pt={"16"}>
        {props.children}
      </Flex>
    </HStack>
  );
}
