"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function AddKnowledgeForm() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill in both question and answer")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add knowledge entry")
      }

      toast.success("Knowledge entry added successfully!")
      setQuestion("")
      setAnswer("")

      // Refresh the page to show new entry
      window.location.reload()
    } catch (error) {
      toast.error("Failed to add entry. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          placeholder="What question might customers ask?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea
          id="answer"
          placeholder="How should the AI respond?"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Adding..." : "Add to Knowledge Base"}
      </Button>
    </form>
  )
}
