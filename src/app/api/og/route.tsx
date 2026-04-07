/**
 * @file route.tsx
 * @description OG image route (/api/og). Generates the 1200×630 Open Graph image used for social media previews.
 */

import { ImageResponse } from "next/og"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#09090b",
        padding: "60px",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Security/Shield icon for 2FA */}
      <svg height="80" style={{ marginBottom: "32px" }} viewBox="0 0 512 512" width="80">
        <path
          d="M256.001,0L29.89,130.537c0,47.476,4.506,88.936,12.057,125.463C88.61,481.721,256.001,512,256.001,512s167.389-30.279,214.053-256c7.551-36.527,12.057-77.986,12.057-125.463L256.001,0z M256.118,466.723c-0.035-0.012-0.082-0.028-0.117-0.039v-47.672V256H140.77H91.122c-6.67-29.738-11.109-63.506-12.394-101.93L255.999,51.728h0.002v51.73V256h115.27h49.625C385.636,413.404,287.327,456.774,256.118,466.723z"
          fill="#fafafa"
        />
      </svg>

      {/* Satori requires display: "flex" on all elements, including text containers */}
      <div
        style={{
          display: "flex",
          fontSize: "56px",
          fontWeight: "600",
          color: "#fafafa",
          letterSpacing: "-1.5px",
        }}
      >
        2FA Debug Tool
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "24px",
          color: "#a1a1aa",
          marginTop: "16px",
        }}
      >
        Generate TOTP QR Codes & Verify Authenticator Codes
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
