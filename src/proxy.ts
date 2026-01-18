import { ROOT_DOMAIN } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    if (hostname.startsWith("localhost")) {
      return null;
    } else if (hostname.includes("localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  const rootDomainFormatted = ROOT_DOMAIN.split(":")[0];

  if (hostname.startsWith(`app.${rootDomainFormatted}`)) {
    return "app";
  }

  if (
    hostname === rootDomainFormatted ||
    hostname === `www.${rootDomainFormatted}`
  ) {
    return null;
  }

  if (hostname.endsWith(`.${rootDomainFormatted}`)) {
    return hostname.replace(`.${rootDomainFormatted}`, "");
  }

  const isSubdomain = hostname !== rootDomainFormatted;

  return isSubdomain ? hostname.split(".")[0] : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  const subdomain = extractSubdomain(request);

  if (!subdomain) {
    if (pathname.startsWith("/app")) {
      const url = request.nextUrl.clone();
      const newPathname = pathname.replace(/^\/app/, "") || "/";
      const rootDomainFormatted = ROOT_DOMAIN.split(":")[0];
      const newHost = `app.${rootDomainFormatted}`;

      return NextResponse.redirect(`${url.protocol}//${newHost}${newPathname}`);
    }
    return;
  }

  if (subdomain === "whitepaper") {
    const url = request.nextUrl.clone();
    url.pathname = `/whitepaper.pdf`;
    return NextResponse.rewrite(url);
  }

  if (subdomain === "app") {
    const url = request.nextUrl.clone();
    if (pathname === "/") {
      url.pathname = "/vaults";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/app")) {
      return NextResponse.rewrite(url);
    }

    url.pathname = `/app${pathname}`;
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/custom-subdomain`;
  url.searchParams.set("subdomain", subdomain);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.css|.*\\.js|.*\\.woff|.*\\.woff2).*)",
  ],
};
