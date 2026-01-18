import { Metadata } from "next";
import { HStack } from "@chakra-ui/react";
import { PageWrapper } from "../_components/PageWrapper";
import { VaultList } from "./_components/VaultList";
import { MintLinkButton } from "./_components/MintLinkButton";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Track your active strategies and manage PnL performance.",
};

export default function Home() {
  return (
    <PageWrapper
      name="My Portfolio"
      description="Track your active strategies and manage PnL performance."
      toolbar={
        <HStack>
          <MintLinkButton />
        </HStack>
      }
    >
      <VaultList />
    </PageWrapper>
  );
}
