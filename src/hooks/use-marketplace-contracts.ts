import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { HookProps, MutationHooksOptions } from "./types";

/*
    name: vector<u8>,
    description: vector<u8>,
    strategy_type: vector<u8>,
    img_url: vector<u8>,
 */
interface CreatePayload {
  name: string;
  description: string;
  strategyType: string;
}

export function useCreate({
  payload,
  options,
}: HookProps<
  CreatePayload,
  MutationHooksOptions<CreatePayload>
>): UseMutationResult<unknown, Error, CreatePayload> {
  return useMutation({
    mutationFn: async (variables) => {},
  });
}
