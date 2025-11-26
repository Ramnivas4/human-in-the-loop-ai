import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/help-requests/respond - Supervisor responds to a request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, answer, addToKnowledge } = body

    if (!id || !answer) {
      return NextResponse.json({ error: "Request ID and answer are required" }, { status: 400 })
    }

    // 1. Get the request to ensure it exists
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id }
    })

    if (!helpRequest) {
      return NextResponse.json({ error: "Help request not found" }, { status: 404 })
    }

    // 2. Update the request with the answer
    const updatedRequest = await prisma.helpRequest.update({
      where: { id },
      data: {
        status: "resolved",
        supervisor_answer: answer,
        resolved_at: new Date()
      }
    })

    let knowledgeEntry = null;

    // 3. Optionally add to knowledge base
    if (addToKnowledge) {
      knowledgeEntry = await prisma.knowledgeBase.create({
        data: {
          question: helpRequest.question,
          answer: answer,
          source: "supervisor",
          help_request_id: id
        }
      })
    }

    console.log(`[v0] Request ${id} resolved by supervisor`)

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      knowledgeEntry,
    })
  } catch (error) {
    console.error("[v0] Error responding to request:", error)
    return NextResponse.json({ error: "Failed to respond to request" }, { status: 500 })
  }
}
