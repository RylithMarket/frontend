import { Image, ImageProps } from "@chakra-ui/react";

interface FaviconProps extends ImageProps {
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "lg" | "2xl";
}

export function Favicon(props: FaviconProps) {
  const { size = "md", ...rest } = props;
  const sizeMap: Record<NonNullable<FaviconProps["size"]>, string> = {
    "2xs": "12px",
    xs: "16px",
    sm: "20px",
    md: "24px",
    lg: "32px",
    xl: "48px",
    "2xl": "64px",
  };

  return (
    <Image
      src="/favicon.svg"
      alt="Favicon"
      width={sizeMap[size]}
      height={sizeMap[size]}
      {...rest}
    />
  );
}
