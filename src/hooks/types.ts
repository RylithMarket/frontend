import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

export type HookProps<
  P = unknown,
  O = MutationHooksOptions | QueryHookOptions,
> = {
  payload?: P;
  options?: O;
};

export type QueryHookOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryKey" | "queryFn"
>;

export type MutationHooksOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = {
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
};
