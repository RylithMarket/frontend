"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

interface Props extends ButtonProps {}
export function DepositLinkButton(props: Props) {
  const router = useRouter();
  const params = useParams();
  const vaultId = params.id as string;

  return (
    <Button
      {...props}
      onClick={() => router.push(`/app/vaults/${vaultId}/deposit`)}
    >
      Deposit
    </Button>
  );
}
