import { Suspense } from "react"
import { KnowledgeBaseList } from "@/components/knowledge-base-list"
import { AddKnowledgeForm } from "@/components/add-knowledge-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, User } from "lucide-react"
import prisma from "@/lib/prisma"

async function getStats() {
  const [totalCount, supervisorCount, manualCount] = await Promise.all([
    prisma.knowledgeBase.count(),
    prisma.knowledgeBase.count({ where: { source: "supervisor" } }),
    prisma.knowledgeBase.count({ where: { source: "manual" } }),
  ])

  return {
    total: totalCount || 0,
    supervisor: supervisorCount || 0,
    manual: manualCount || 0,
  }
}

export default async function KnowledgePage() {
  const stats = await getStats()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">Learned answers and information for the AI agent</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Available to AI agent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learned from Supervisor</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supervisor}</div>
            <p className="text-xs text-muted-foreground">Auto-learned answers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manual Entries</CardTitle>
            <User className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.manual}</div>
            <p className="text-xs text-muted-foreground">Manually added</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Knowledge Entries</CardTitle>
              <CardDescription>Questions and answers the AI can reference</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading knowledge base...</div>}>
                <KnowledgeBaseList />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Entry</CardTitle>
              <CardDescription>Manually add knowledge to the AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              <AddKnowledgeForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
