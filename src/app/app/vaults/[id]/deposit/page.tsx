import { PageWrapper } from "@/app/app/_components/PageWrapper";
import { VaultDepositContent } from "./_components/VaultDepositContent";

export default function Page() {
  return (
    <PageWrapper
      name="Deposit"
      description="Deposit into your vault strategies."
    >
      <VaultDepositContent />
    </PageWrapper>
  );
}
