import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
        }

        await prisma.helpRequest.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[v0] Error deleting help request:", error)
        return NextResponse.json({ error: "Failed to delete help request" }, { status: 500 })
    }
}
