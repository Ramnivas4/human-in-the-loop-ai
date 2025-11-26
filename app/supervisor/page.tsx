import { Suspense } from "react"
import { HelpRequestsList } from "@/components/help-requests-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import prisma from "@/lib/prisma"
import { SimulateRequestButton } from "@/components/simulate-request-button"

async function getStats() {
  const [pendingCount, resolvedCount, timeoutCount] = await Promise.all([
    prisma.helpRequest.count({ where: { status: "pending" } }),
    prisma.helpRequest.count({ where: { status: "resolved" } }),
    prisma.helpRequest.count({ where: { status: "timeout" } }),
  ])

  return {
    pending: pendingCount || 0,
    resolved: resolvedCount || 0,
    timeout: timeoutCount || 0,
  }
}


export default async function SupervisorPage() {
  const stats = await getStats()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">Manage AI agent escalations and help requests</p>
        </div>
        <SimulateRequestButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting supervisor response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Successfully answered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timed Out</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeout}</div>
            <p className="text-xs text-muted-foreground">No response within 30 min</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {stats.pending > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stats.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Suspense fallback={<div>Loading pending requests...</div>}>
            <HelpRequestsList status="pending" />
          </Suspense>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Suspense fallback={<div>Loading resolved requests...</div>}>
            <HelpRequestsList status="resolved" />
          </Suspense>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Suspense fallback={<div>Loading all requests...</div>}>
            <HelpRequestsList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
