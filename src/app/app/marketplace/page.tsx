import { PageWrapper } from "../_components/PageWrapper";
import { MarketplaceList } from "./_components/MarketplaceList";

export default function Page() {
  return (
    <PageWrapper
      name="Marketplace"
      description="Trade live DeFi strategies without unwinding or losing time-based rewards"
    >
      <MarketplaceList />
    </PageWrapper>
  );
}
