"use client";

import {
  chakra,
  HTMLChakraProps,
  Icon,
  IconButton,
  Stack,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSuperpowers } from "react-icons/fa";
import { PiVaultFill } from "react-icons/pi";
import { motion } from "motion/react";

interface Props extends HTMLChakraProps<"nav"> {}
export function Navbar(props: Props) {
  const pathname = usePathname();
  const items = [
    { label: "vaults", href: "/vaults", icon: PiVaultFill },
    { label: "marketplace", href: "/marketplace", icon: FaSuperpowers },
  ];

  const isActive = (href: string) => {
    const normalizedPathname = pathname.replace(/^\/app/, "") || "/";
    const normalizedHref = href.replace(/^\/app/, "") || "/";
    return normalizedPathname.startsWith(normalizedHref);
  };

  return (
    <chakra.nav
      w={["fit", "fit", "fit"]}
      pl={["2", "4", "4"]}
      pr={["2", "8", "16", "32"]}
      py={["2", "4", "4"]}
      {...props}
    >
      <Stack gap={"4"} direction={["row", "row", "column", "column"]}>
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
          >
            <IconButton
              aria-label={item.label}
              bg={isActive(item.href) ? "bg.subtle/50" : "transparent"}
              color={isActive(item.href) ? "fg" : "fg.subtle"}
              _hover={{ bg: "bg.subtle", color: "fg" }}
              border={isActive(item.href) ? "1px solid" : "none"}
              borderColor={"fg.subtle"}
              size={["sm", "md", "md"]}
              asChild
            >
              <Link href={item.href}>
                <Icon as={item.icon} />
              </Link>
            </IconButton>
          </motion.div>
        ))}
      </Stack>
    </chakra.nav>
  );
}
