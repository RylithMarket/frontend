import { PageWrapper } from "../../_components/PageWrapper";
import { VaultAssetsContent } from "./_components/VaultAssetsContent";

export default function Page() {
  return (
    <PageWrapper
      name="Assets"
      description="Trade live DeFi strategies without unwinding or losing time-based rewards"
    >
      <VaultAssetsContent />
    </PageWrapper>
  );
}
