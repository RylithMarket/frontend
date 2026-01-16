import { VStack } from "@chakra-ui/react";
import { HeroSection } from "./_sections/HeroSection";

export default function Home() {
  return (
    <main style={{ width: "100%", height: "100%" }}>
      <VStack
        w={"full"}
        h={"full"}
        pt={"8"}
        bgImage={
          "radial-gradient(179.58% 100% at 50% 0%, #000000 32.69%, #090943 59.08%, #110E96 75.37%, #3B30F8 86.46%, #B1ACFF 97.6%)"
        }
      >
        <HeroSection/>
      </VStack>
    </main>
  );
}
