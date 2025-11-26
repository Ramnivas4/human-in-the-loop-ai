import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/call-logs - Retrieve call logs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const logs = await prisma.callLog.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("[v0] Error fetching call logs:", error)
    return NextResponse.json({ error: "Failed to fetch call logs" }, { status: 500 })
  }
}

// POST /api/call-logs - Create new call log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caller_phone, caller_name, call_duration, conversation_summary, escalated, help_request_id } = body

    if (!caller_phone) {
      return NextResponse.json({ error: "caller_phone is required" }, { status: 400 })
    }

    const log = await prisma.callLog.create({
      data: {
        caller_phone,
        caller_name,
        call_duration,
        conversation_summary,
        escalated: escalated || false,
        help_request_id,
      }
    })

    console.log(`[v0] Call log created for ${caller_phone}`)

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating call log:", error)
    return NextResponse.json({ error: "Failed to create call log" }, { status: 500 })
  }
}
