import { PageWrapper } from "@/app/app/_components/PageWrapper";
import { VaultListContent } from "./_components/VaultListContent";

export default function Page() {
  return (
    <PageWrapper
      name="List"
      description="Create a new listing for your vault strategies."
    >
      <VaultListContent />
    </PageWrapper>
  );
}
