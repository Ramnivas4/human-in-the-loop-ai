import prisma from "@/lib/prisma"
import { KnowledgeBaseItem } from "@/components/knowledge-base-item"

export async function KnowledgeBaseList() {
  let entries;
  try {
    entries = await prisma.knowledgeBase.findMany({
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    return <div className="text-red-500">Error loading knowledge base: {(error as Error).message}</div>
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No knowledge entries yet. Add some to get started!</div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <KnowledgeBaseItem
          key={entry.id}
          entry={{
            ...entry,
            source: entry.source as "supervisor" | "manual" | "initial",
            created_at: entry.created_at.toISOString(),
            updated_at: entry.updated_at.toISOString(),
          }}
        />
      ))}
    </div>
  )
}
