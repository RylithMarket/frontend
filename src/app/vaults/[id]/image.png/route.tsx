import { ImageResponse } from "next/og";
import { rylithApi } from "@/utils/rylithApi";

// Hàm load font từ Google an toàn
async function loadGoogleFont(font: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }
  throw new Error("failed to load font data");
}

export const runtime = "edge";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const response = await rylithApi.get(`/vaults/${id}`);
    const vault = response.data;

    const tvl = parseFloat(vault.tvl || "0");
    const tvlFormatted = `$${tvl.toFixed(6)}`;
    const strategiesCount = vault.positions?.length || 0;

    const [fontRegular, fontBold] = await Promise.all([
      loadGoogleFont("Roboto", 400),
      loadGoogleFont("Roboto", 700),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "80px",
            background:
              "radial-gradient(75.07% 100% at 50% -10%, #000000 32.69%, #090943 59.08%, #110E96 75.37%, #3B30F8 86.46%, #B1ACFF 97.6%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Roboto",
          }}
        >
          {/* Vault Name */}
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: "64px",
              fontWeight: 400,
              textAlign: "center",
              opacity: 0.9,
              lineHeight: "1.2",
              textTransform: "uppercase"
            }}
          >
            {vault.name || "Strategy Vault"}
          </div>

          {/* TVL */}
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: "130px",
              fontWeight: 700,
              lineHeight: "1",
              textAlign: "center",
            }}
          >
            {tvlFormatted}
          </div>

          {/* Strategies Count */}
          <div
            style={{
              display: "flex",
              color: "#B1ACFF",
              fontSize: "64px",
              fontWeight: 400,
              lineHeight: "1.2",
            }}
          >
            {strategiesCount} strategies
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 1200,
        fonts: [
          {
            name: "Roboto",
            data: fontRegular,
            style: "normal",
            weight: 400,
          },
          {
            name: "Roboto",
            data: fontBold,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Error generating image", { status: 500 });
  }
}
