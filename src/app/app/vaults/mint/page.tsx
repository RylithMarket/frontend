import { Flex } from "@chakra-ui/react";
import { PageWrapper } from "../../_components/PageWrapper";
import { MintVaultForm } from "../_components/MintVaultForm";

export default function Page() {
  return (
    <PageWrapper
      name="Mint Vault"
      description="Create a new vault to start managing your assets."
    >
      <Flex w={"full"} h={"full"} maxW={"2xl"}>
        <MintVaultForm />
      </Flex>
    </PageWrapper>
  );
}
