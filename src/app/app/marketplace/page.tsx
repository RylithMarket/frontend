import { Metadata } from "next";
import { PageWrapper } from "../_components/PageWrapper";
import { MarketplaceList } from "./_components/MarketplaceList";

export const metadata: Metadata = {
  title: "Explore Strategies",
  description: "Discover and trade high-performing DeFi strategy vaults.",
};

export default function Page() {
  return (
    <PageWrapper
      name="Explore Strategies"
      description="Discover and trade high-performing DeFi strategy vaults."
    >
      <MarketplaceList />
    </PageWrapper>
  );
}
