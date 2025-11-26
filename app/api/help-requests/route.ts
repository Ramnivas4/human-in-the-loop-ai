import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/help-requests - Retrieve help requests
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const where = status ? { status } : {}

    const requests = await prisma.helpRequest.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("[v0] Error fetching help requests:", error)
    return NextResponse.json({ error: "Failed to fetch help requests" }, { status: 500 })
  }
}

// POST /api/help-requests - Create new help request (from AI agent)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caller_phone, caller_name, question, context, room_name } = body

    if (!caller_phone || !question) {
      return NextResponse.json({ error: "caller_phone and question are required" }, { status: 400 })
    }

    const requestData = await prisma.helpRequest.create({
      data: {
        caller_phone,
        caller_name,
        question,
        context,
        room_name,
        status: "pending",
      }
    })

    // Simulate supervisor notification
    console.log("[v0] ===== SUPERVISOR NOTIFICATION =====")
    console.log(`[v0] New help request from ${caller_name || caller_phone}`)
    console.log(`[v0] Question: ${question}`)
    console.log(`[v0] Request ID: ${requestData.id}`)
    console.log("[v0] ====================================")

    return NextResponse.json({ request: requestData }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating help request:", error)
    return NextResponse.json({ error: "Failed to create help request" }, { status: 500 })
  }
}
