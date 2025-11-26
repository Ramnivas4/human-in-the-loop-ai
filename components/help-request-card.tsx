"use client"

import { useState } from "react"
import type { HelpRequest } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { Phone, Clock, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface HelpRequestCardProps {
  request: HelpRequest
}

export function HelpRequestCard({ request }: HelpRequestCardProps) {
  const [isResponding, setIsResponding] = useState(false)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const statusColors = {
    pending: "bg-orange-500",
    resolved: "bg-green-500",
    timeout: "bg-red-500",
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/help-requests/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: request.id,
          answer: answer.trim(),
          addToKnowledge: true, // Default to true for now as it's a helpful feature
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit answer")
      }

      toast.success("Answer submitted successfully! Caller will be notified.")
      setIsResponding(false)
      setAnswer("")

      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      toast.error("Failed to submit answer. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/help-requests/${request.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete request")
      }

      toast.success("Request deleted")
      window.location.reload()
    } catch (error) {
      toast.error("Failed to delete request")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {request.caller_name || "Unknown Caller"}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {request.caller_phone}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[request.status]}>{request.status}</Badge>
            {request.status !== "pending" && (
              <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Question:</h4>
          <p className="text-sm">{request.question}</p>
        </div>

        {request.context && (
          <div>
            <h4 className="text-sm font-medium mb-1">Context:</h4>
            <p className="text-sm text-muted-foreground">{request.context}</p>
          </div>
        )}

        {request.supervisor_answer && (
          <div>
            <h4 className="text-sm font-medium mb-1">Your Answer:</h4>
            <p className="text-sm bg-muted p-3 rounded-md">{request.supervisor_answer}</p>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </div>
          {request.status === "pending" && request.timeout_at && (
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="h-3 w-3" />
              Timeout {formatDistanceToNow(new Date(request.timeout_at), { addSuffix: true })}
            </div>
          )}
        </div>

        {isResponding && request.status === "pending" && (
          <div className="space-y-2 pt-4">
            <Textarea
              placeholder="Enter your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
            />
          </div>
        )}
      </CardContent>

      {request.status === "pending" && (
        <CardFooter className="flex gap-2">
          {!isResponding ? (
            <div className="flex gap-2 w-full">
              <Button onClick={() => setIsResponding(true)} className="flex-1">
                Respond to Request
              </Button>
              {request.room_name && (
                <Button
                  onClick={() => window.open(`/supervisor/call/${request.room_name}`, '_blank')}
                  variant="secondary"
                  className="gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Join Call
                </Button>
              )}
            </div>
          ) : (
            <>
              <Button onClick={handleSubmitAnswer} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsResponding(false)
                  setAnswer("")
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
