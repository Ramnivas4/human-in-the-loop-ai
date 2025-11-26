import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/help-requests/timeout - Mark old pending requests as timeout
export async function POST() {
  try {
    const timeoutThreshold = new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago

    // Find requests to timeout
    const timedOutRequests = await prisma.helpRequest.findMany({
      where: {
        status: "pending",
        created_at: {
          lt: timeoutThreshold
        }
      }
    })

    if (timedOutRequests.length === 0) {
      return NextResponse.json({ message: "No requests to timeout", count: 0 })
    }

    // Update them
    await prisma.helpRequest.updateMany({
      where: {
        id: {
          in: timedOutRequests.map(r => r.id)
        }
      },
      data: {
        status: "timeout",
        timeout_at: new Date()
      }
    })

    console.log(`[v0] Timed out ${timedOutRequests.length} requests`)

    return NextResponse.json({
      message: "Requests timed out",
      count: timedOutRequests.length,
      ids: timedOutRequests.map(r => r.id)
    })
  } catch (error) {
    console.error("[v0] Error timing out requests:", error)
    return NextResponse.json({ error: "Failed to timeout requests" }, { status: 500 })
  }
}
