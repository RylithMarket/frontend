"use client";

import { Button } from "@/components/ui/button";
import { useCreateVault } from "@/hooks/use-core-contracts";
import {
  chakra,
  FieldLabel,
  FieldRoot,
  HStack,
  Input,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
  name: string;
  description: string;
  strategyType: string;
}

interface Props extends StackProps {}
export function MintVaultForm(props: Props) {
  const { register, handleSubmit } = useForm<Inputs>();

  const mintMutation = useCreateVault();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mintMutation.mutate({
      name: data.name,
      description: data.description,
      strategyType: data.strategyType,
    });
  };

  return (
    <chakra.form w={"full"} onSubmit={handleSubmit(onSubmit)}>
      <VStack w={"full"} gap={"6"} align={"start"} {...props}>
        <HStack w={"full"} gap={"4"}>
          <FieldRoot required>
            <FieldLabel>Name</FieldLabel>
            <Input
              px={"2"}
              variant="subtle"
              {...register("name", { required: true })}
            />
          </FieldRoot>
          <FieldRoot required>
            <FieldLabel>Strategy Type</FieldLabel>
            <Input
              px={"2"}
              variant="subtle"
              {...register("strategyType", { required: true })}
            />
          </FieldRoot>
        </HStack>
        <FieldRoot w={"full"}>
          <FieldLabel>Description</FieldLabel>
          <Input px={"2"} variant="subtle" {...register("description")} />
        </FieldRoot>
        <Button
          type="submit"
          loadingText="Minting"
          loading={mintMutation.isPending}
          disabled={mintMutation.isPending}
        >
          Mint now
        </Button>
      </VStack>
    </chakra.form>
  );
}
