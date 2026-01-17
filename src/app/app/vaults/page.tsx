import { HStack } from "@chakra-ui/react";
import { PageWrapper } from "../_components/PageWrapper";
import { VaultList } from "./_components/VaultList";
import { MintLinkButton } from "./_components/MintLinkButton";

export default function Home() {
  return (
    <PageWrapper
      name="Vaults"
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
