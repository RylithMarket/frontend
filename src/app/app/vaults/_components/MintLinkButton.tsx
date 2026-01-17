"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props extends ButtonProps {}
export function MintLinkButton(props: Props) {
  const router = useRouter();

  return (
    <Button {...props} onClick={() => router.push("/app/vaults/mint")}>
      Mint
    </Button>
  );
}
