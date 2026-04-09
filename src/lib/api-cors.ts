import { NextResponse } from "next/server"

const PUBLIC_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  Vary: "Origin",
}

export function withPublicCors(response: NextResponse) {
  for (const [header, value] of Object.entries(PUBLIC_CORS_HEADERS)) {
    response.headers.set(header, value)
  }

  return response
}

export function buildCorsPreflightResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: PUBLIC_CORS_HEADERS,
  })
}
