import prisma from "@/lib/prisma"
import type { HelpRequest } from "@/lib/types"
import { HelpRequestCard } from "./help-request-card"

interface HelpRequestsListProps {
  status?: "pending" | "resolved" | "timeout"
}

export async function HelpRequestsList({ status }: HelpRequestsListProps) {
  let requests;
  try {
    requests = await prisma.helpRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    return <div className="text-red-500">Error loading requests: {(error as Error).message}</div>
  }

  if (!requests || requests.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No {status ? status : ""} requests found</div>
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <HelpRequestCard key={request.id} request={request as unknown as HelpRequest} />
      ))}
    </div>
  )
}
