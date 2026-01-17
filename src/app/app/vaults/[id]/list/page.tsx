import { Metadata } from "next";
import { PageWrapper } from "@/app/app/_components/PageWrapper";
import { VaultListContent } from "./_components/VaultListContent";

export const metadata: Metadata = {
  title: "Sell Vault | Rylith",
  description: "List your vault for sale to monetize your position.",
};

export default function Page() {
  return (
    <PageWrapper
      name="Sell Vault"
      description="List your vault for sale to monetize your position."
    >
      <VaultListContent />
    </PageWrapper>
  );
}
