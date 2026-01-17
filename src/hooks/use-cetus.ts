import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { HookProps, MutationHooksOptions } from "./types";
import { Transaction } from "@mysten/sui/transactions";
import { useBorrowMutAsset } from "./use-core-contracts";
import { cetusSdk } from "@/utils/cetusSdk";
import { RemoveLiquidityParams } from "@cetusprotocol/sui-clmm-sdk";
import { VAULT_CONTRACT } from "@/constants";
import { toaster } from "@/components/ui/toaster";

interface RemoveLiquidityFromVaultPayload {
  vaultId: string;
  positionName: string;
  poolId: string;
  positionId: string;
  coinTypeA: string;
  coinTypeB: string;
  deltaLiquidity: string;
  minAmountA: string;
  minAmountB: string;
  collectFee?: boolean;
  rewarderCoinTypes?: string[];
}

interface AddLiquidityPayload {
  poolId: string;
  coinAAmount: string;
  coinBAmount: string;
  tickLower: number;
  tickUpper: number;
}

export function useCetusRemoveLiquidityFromVault({
  options,
}: HookProps<
  RemoveLiquidityFromVaultPayload,
  MutationHooksOptions<string, Error, RemoveLiquidityFromVaultPayload>
> = {}): UseMutationResult<string, Error, RemoveLiquidityFromVaultPayload> {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const borrowMutAsset = useBorrowMutAsset();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RemoveLiquidityFromVaultPayload) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      const cetusPackageId = cetusSdk.sdkOptions.clmm_pool.package_id;
      const globalConfig =
        cetusSdk.sdkOptions.clmm_pool.config?.global_config_id;

      if (!globalConfig) {
        throw new Error("Cetus global config not found");
      }

      const [position] = tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::withdraw_asset`,
        arguments: [
          tx.object(payload.vaultId),
          tx.pure.string(payload.positionName), // vector<u8>
          tx.object("0x6"), // Clock
        ],
        typeArguments: [`${cetusPackageId}::position::Position`],
      });

      const [balanceA, balanceB] = tx.moveCall({
        target: `${cetusPackageId}::pool::remove_liquidity`,
        arguments: [
          tx.object(globalConfig),
          tx.object(payload.poolId),
          position,
          tx.pure.u128(payload.deltaLiquidity),
          tx.object("0x6"),
        ],
        typeArguments: [payload.coinTypeA, payload.coinTypeB],
      });

      const [balanceA_Fee, balanceB_Fee] = tx.moveCall({
        target: `${cetusPackageId}::pool::collect_fee`,
        arguments: [
          tx.object(globalConfig),
          tx.object(payload.poolId),
          position,
          tx.pure.bool(false),
        ],
        typeArguments: [payload.coinTypeA, payload.coinTypeB],
      });

      tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::deposit_asset`,
        arguments: [
          tx.object(payload.vaultId),
          position, // Nạp lại chính object đó
          tx.pure.string(payload.positionName),
          tx.object("0x6"),
        ],
        typeArguments: [`${cetusPackageId}::position::Position`],
      });

      const [coinA] = tx.moveCall({
        target: `0x2::coin::from_balance`,
        arguments: [balanceA],
        typeArguments: [payload.coinTypeA],
      });

      // 4. Xử lý Balance B: Tương tự
      const [coinB] = tx.moveCall({
        target: `0x2::coin::from_balance`,
        arguments: [balanceB],
        typeArguments: [payload.coinTypeB],
      });

      tx.transferObjects([coinA, coinB], currentAccount.address);

      return new Promise<string>((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              toaster.create({
                title: "Success",
                description: "Liquidity removed successfully",
                type: "success",
                duration: 4000,
                closable: true,
              });
              resolve(result.digest);
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["vault"] });
              queryClient.invalidateQueries({ queryKey: ["vault-asset"] });
            },
            onError: (error) => {
              toaster.create({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to remove liquidity",
                type: "error",
                duration: 4000,
                closable: true,
              });
              reject(error);
            },
          },
        );
      });
    },
    ...options?.options,
  });
}
interface AddLiquidityToVaultPayload {
  vaultId: string;
  positionName: string;
  poolId: string;
  coinTypeA: string;
  coinTypeB: string;

  deltaLiquidity: string;
  maxAmountA: string;
  maxAmountB: string;

  inputCoinAId: string;
  inputCoinBId: string;
}

export function useCetusAddLiquidityToVault({
  options,
}: HookProps<
  AddLiquidityToVaultPayload,
  MutationHooksOptions<string, Error, AddLiquidityToVaultPayload>
> = {}): UseMutationResult<string, Error, AddLiquidityToVaultPayload> {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddLiquidityToVaultPayload) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();

      const cetusPackageId = cetusSdk.sdkOptions.clmm_pool.package_id;
      const globalConfig =
        cetusSdk.sdkOptions.clmm_pool.config?.global_config_id;

      if (!globalConfig) {
        throw new Error("Cetus global config not found");
      }

      const [coinAInput] = tx.splitCoins(tx.object(payload.inputCoinAId), [
        tx.pure.u64(payload.maxAmountA),
      ]);

      const [coinBInput] = tx.splitCoins(tx.object(payload.inputCoinBId), [
        tx.pure.u64(payload.maxAmountB),
      ]);

      const [position] = tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::withdraw_asset`,
        arguments: [
          tx.object(payload.vaultId),
          tx.pure.string(payload.positionName),
          tx.object("0x6"),
        ],
        typeArguments: [`${cetusPackageId}::position::Position`],
      });

      const [balanceA_Change, balanceB_Change] = tx.moveCall({
        target: `${cetusPackageId}::pool::add_liquidity`,
        arguments: [
          tx.object(globalConfig),
          tx.object(payload.poolId),
          position,
          tx.pure.u128(payload.deltaLiquidity),
          tx.pure.u64(payload.maxAmountA),
          tx.pure.u64(payload.maxAmountB),
          coinAInput,
          coinBInput,
          tx.object("0x6"),
        ],
        typeArguments: [payload.coinTypeA, payload.coinTypeB],
      });

      tx.moveCall({
        target: `${VAULT_CONTRACT.packageId}::${VAULT_CONTRACT.moduleName}::deposit_asset`,
        arguments: [
          tx.object(payload.vaultId),
          position,
          tx.pure.string(payload.positionName),
          tx.object("0x6"),
        ],
        typeArguments: [`${cetusPackageId}::position::Position`],
      });

      const [coinA_Change] = tx.moveCall({
        target: `0x2::coin::from_balance`,
        arguments: [balanceA_Change],
        typeArguments: [payload.coinTypeA],
      });

      const [coinB_Change] = tx.moveCall({
        target: `0x2::coin::from_balance`,
        arguments: [balanceB_Change],
        typeArguments: [payload.coinTypeB],
      });

      tx.transferObjects([coinA_Change, coinB_Change], currentAccount.address);

      return new Promise<string>((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              toaster.create({
                title: "Success",
                description: "Liquidity added successfully",
                type: "success",
                duration: 4000,
                closable: true,
              });
              resolve(result.digest);
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["vault"] });
              queryClient.invalidateQueries({ queryKey: ["vault-asset"] });
            },
            onError: (error) => {
              toaster.create({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to add liquidity",
                type: "error",
                duration: 4000,
                closable: true,
              });
              reject(error);
            },
          },
        );
      });
    },
    ...options?.options,
  });
}
