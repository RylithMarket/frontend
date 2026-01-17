"use client";

import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { formatAddress } from "@/libs/formats";
import {
  AvatarImage,
  AvatarRoot,
  ButtonProps,
  HStack,
  Icon,
  MenuRootProps,
  StackProps,
  Text,
} from "@chakra-ui/react";
import {
  ConnectModal,
  useAutoConnectWallet,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { useSuiBalance } from "@/hooks/use-sui";
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineDisconnect } from "react-icons/ai";

interface Props extends ButtonProps {}
export function ConnectWallet(props: Props) {
  useAutoConnectWallet();
  const { isConnecting } = useCurrentWallet();
  const currentAccount = useCurrentAccount();

  if (currentAccount) {
    return <WrapperMenu />;
  }

  return (
    <ConnectModal
      trigger={
        <Button
          variant={"surface"}
          loading={isConnecting}
          disabled={isConnecting}
          {...props}
        >
          Connect
        </Button>
      }
    />
  );
}

interface WrapperProps extends StackProps {}
export function WrapperMenu(props: WrapperProps) {
  return (
    <HStack p={"1"} bg={"bg.subtle/75"} rounded={"2xl"} {...props}>
      <BalanceMenu />
      <ProfileMenu />
    </HStack>
  );
}

interface BalanceProps extends StackProps {}
export function BalanceMenu(props: BalanceProps) {
  const currentAccount = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  const { data: balance } = useSuiBalance();

  if (!currentAccount) {
    return null;
  }

  return (
    <HStack px={"2"} {...props}>
      <AvatarRoot size={"2xs"}>
        <AvatarImage
          src={"https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png"}
        />
      </AvatarRoot>
      <Text fontWeight="medium">{balance?.formatted || "0.00"} SUI</Text>
    </HStack>
  );
}
interface ProfileProps extends Omit<MenuRootProps, "children"> {}
export function ProfileMenu(props: ProfileProps) {
  const currentAccount = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  const disconnectMutation = useDisconnectWallet();

  if (!currentAccount) {
    return null;
  }

  return (
    <MenuRoot {...props}>
      <MenuTrigger>
        <HStack
          bg={"bg.inverted"}
          w={"fit"}
          h={"fit"}
          p={"2"}
          rounded={"2xl"}
          gap={"2"}
        >
          <AvatarRoot size={"2xs"}>
            <AvatarImage
              src={
                currentWallet?.icon ||
                "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png"
              }
            />
          </AvatarRoot>
          <Text
            color={"fg.inverted"}
            fontWeight={"medium"}
            _hover={{ color: "#4DA2FF" }}
          >
            {formatAddress(currentAccount.address)}
          </Text>
          <Icon as={FaAngleDown} color={"fg.inverted"} />
        </HStack>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          p={"2"}
          bg={"transparent"}
          cursor={"pointer"}
          value="disconnect"
          onSelect={() => disconnectMutation.mutate()}
        >
          Disconnect
          <Icon as={AiOutlineDisconnect} />
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
