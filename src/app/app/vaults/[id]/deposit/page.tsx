import { Metadata } from "next";
import { PageWrapper } from "@/app/app/_components/PageWrapper";
import { VaultDepositContent } from "./_components/VaultDepositContent";

export const metadata: Metadata = {
  title: "Add Funds",
  description: "Inject capital to execute strategy and generate yield.",
};

export default function Page() {
  return (
    <PageWrapper
      name="Add Funds"
      description="Inject capital to execute strategy and generate yield."
      justify={"start"}
      overflow={"auto"}
      css={{
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
      _open={{
        animationName: "fade-in, scale-in",
        animationDuration: "300ms",
      }}
      _closed={{
        animationName: "fade-out, scale-out",
        animationDuration: "120ms",
      }}
    >
      <VaultDepositContent />
    </PageWrapper>
  );
}
