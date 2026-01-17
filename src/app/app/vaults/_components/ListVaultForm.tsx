"use client";

import { Button } from "@/components/ui/button";
import { useGetVaultById } from "@/hooks/use-rylith-api";
import { useGetCurrentPrices } from "@/hooks/use-defillama";
import { useListVault } from "@/hooks/use-marketplace";
import {
  chakra,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  HStack,
  Input,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
  price: string;
  royalty: string;
  fee: string;
}

interface Props extends StackProps {
  vaultId: string;
}

export function ListVaultForm({ vaultId, ...props }: Props) {
  const { data: vault } = useGetVaultById({
    payload: { vaultId },
  });

  const { data: pricesData } = useGetCurrentPrices({
    payload: { coins: "coingecko:sui" },
  });

  const listVaultMutation = useListVault();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<Inputs>();

  const priceValue = watch("price");

  const suiPrice = pricesData?.coins?.["coingecko:sui"]?.price || 0;

  useEffect(() => {
    if (vault?.tvl) {
      setValue("price", vault.tvl.toFixed(6));
    }
  }, [vault?.tvl, setValue]);

  const calculateUsdValue = () => {
    if (!priceValue || !suiPrice) return "0.00";
    const price = parseFloat(priceValue);
    return (price * suiPrice).toFixed(6);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const priceInMist = BigInt(Math.round(parseFloat(data.price) * 1e9));
    listVaultMutation.mutate({
      vaultId,
      price: priceInMist,
    });
  };

  return (
    <chakra.form w={"full"} onSubmit={handleSubmit(onSubmit)}>
      <VStack w={"full"} gap={"6"} align={"start"} {...props}>
        <HStack w={"full"} gap={"4"}>
          <FieldRoot required>
            <FieldLabel>Price</FieldLabel>
            <Input
              px={"2"}
              variant="subtle"
              placeholder="e.g 23 SUI"
              {...register("price", { required: true })}
            />
            <Text fontSize={"xs"} color={"fg.muted"} mt={1}>
              ≈ ${calculateUsdValue()}
            </Text>
          </FieldRoot>
        </HStack>
        <FieldRoot>
          <FieldLabel>Royalty</FieldLabel>
          <Input
            px={"2"}
            variant="subtle"
            placeholder="e.g 2"
            {...register("royalty")}
          />
          <FieldHelperText>Enter as number (e.g 2 for 2%)</FieldHelperText>
        </FieldRoot>
        <FieldRoot>
          <FieldLabel>Fee</FieldLabel>
          <Input
            px={"2"}
            variant="subtle"
            placeholder="e.g 0.001 SUI"
            {...register("fee")}
          />
        </FieldRoot>
        <Button
          type="submit"
          loadingText="Listing"
          loading={listVaultMutation.isPending}
          disabled={listVaultMutation.isPending || !isValid}
        >
          List
        </Button>
      </VStack>
    </chakra.form>
  );
}
