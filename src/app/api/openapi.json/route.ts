import { NextResponse } from "next/server"

import { buildCorsPreflightResponse, withPublicCors } from "@/lib/api-cors"
import { openApiDocument } from "@/lib/openapi"

export async function OPTIONS() {
  return buildCorsPreflightResponse()
}

export async function GET() {
  return withPublicCors(NextResponse.json(openApiDocument))
}
