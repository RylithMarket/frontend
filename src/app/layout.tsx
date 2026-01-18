import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import Provider from "./provider";
import { VStack } from "@chakra-ui/react";
import { Header } from "./_components/Header";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rylith",
    default: "Rylith - Liquid Strategy Marketplace",
  },
  description:
    "Trade live DeFi strategies without unwinding or losing time-based rewards. The liquid strategy marketplace for Web3 traders.",
  keywords: [
    "DeFi",
    "strategies",
    "marketplace",
    "Sui blockchain",
    "trading",
    "yield",
  ],
  openGraph: {
    title: "Rylith - Liquid Strategy Marketplace",
    description:
      "Trade live DeFi strategies without unwinding or losing time-based rewards.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rylith - Liquid Strategy Marketplace",
    description:
      "Trade live DeFi strategies without unwinding or losing time-based rewards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Provider>
          <VStack w={"full"} h={"100vh"}>
            <Header />
            {children}
          </VStack>
        </Provider>
      </body>
    </html>
  );
}
