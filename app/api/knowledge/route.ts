import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/knowledge - Retrieve all knowledge entries or search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (query) {
      // Search for similar questions using Prisma's contains
      // Note: For better full-text search in MySQL, we might need raw queries or a dedicated search engine
      const entries = await prisma.knowledgeBase.findMany({
        where: {
          OR: [
            { question: { contains: query } }, // MySQL case-insensitive by default usually, but depends on collation
            { answer: { contains: query } }
          ]
        },
        orderBy: {
          usage_count: 'desc'
        },
        take: 5
      })

      return NextResponse.json({ entries })
    } else {
      // Return all entries
      const entries = await prisma.knowledgeBase.findMany({
        orderBy: {
          created_at: 'desc'
        }
      })

      return NextResponse.json({ entries })
    }
  } catch (error) {
    console.error("[v0] Error fetching knowledge:", error)
    return NextResponse.json({ error: "Failed to fetch knowledge entries" }, { status: 500 })
  }
}

// POST /api/knowledge - Add new knowledge entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer } = body

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }

    const entry = await prisma.knowledgeBase.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        source: "manual",
      }
    })

    console.log("[v0] New knowledge entry added:", question)

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding knowledge:", error)
    return NextResponse.json({ error: "Failed to add knowledge entry" }, { status: 500 })
  }
}

// PATCH /api/knowledge - Increment usage count
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 })
    }

    await prisma.knowledgeBase.update({
      where: { id },
      data: {
        usage_count: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating knowledge usage:", error)
    return NextResponse.json({ error: "Failed to update usage count" }, { status: 500 })
  }
}

// DELETE /api/knowledge - Delete knowledge entry
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 })
    }

    await prisma.knowledgeBase.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting knowledge entry:", error)
    return NextResponse.json({ error: "Failed to delete knowledge entry" }, { status: 500 })
  }
}
