"use client";

import {
  chakra,
  HTMLChakraProps,
  Icon,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSuperpowers } from "react-icons/fa";
import { PiVaultFill } from "react-icons/pi";

interface Props extends HTMLChakraProps<"nav"> {}
export function Navbar(props: Props) {
  const pathname = usePathname();
  const items = [
    { label: "vaults", href: "/app/vaults", icon: PiVaultFill },
    { label: "marketplace", href: "/app/marketplace", icon: FaSuperpowers },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <chakra.nav w="fit" pl="4" pr={"32"} py="4" {...props}>
      <VStack>
        {items.map((item) => (
          <IconButton
            key={item.label}
            aria-label={item.label}
            bg={isActive(item.href) ? "bg.subtle/50" : "transparent"}
            color={isActive(item.href) ? "fg" : "fg.subtle"}
            _hover={{ bg: "bg.subtle", color: "fg" }}
            border={isActive(item.href) ? "1px solid" : "none"}
            borderColor={"fg.subtle"}
            asChild
          >
            <Link href={item.href}>
              <Icon as={item.icon} />
            </Link>
          </IconButton>
        ))}
      </VStack>
    </chakra.nav>
  );
}
