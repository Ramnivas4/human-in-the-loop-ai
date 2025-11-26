"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { PlayCircle } from "lucide-react"

const SAMPLE_QUESTIONS = [
    "Do you offer teeth whitening?",
    "Do you accept cryptocurrency?",
    "Can I book a consultation for a wedding party?",
    "Is there a discount for students?",
    "Do you have a loyalty program?",
    "My hair turned green after swimming, help!",
    "Do you do beard trims?",
]

export function SimulateRequestButton() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSimulate = async () => {
        setIsLoading(true)
        try {
            const randomQuestion = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)]

            const response = await fetch("/api/help-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caller_phone: "+1-555-0199",
                    caller_name: "Simulated User",
                    question: randomQuestion,
                    context: "Simulated request from dashboard",
                }),
            })

            if (!response.ok) throw new Error("Failed to create request")

            toast({
                title: "Request Simulated",
                description: `Created help request: "${randomQuestion}"`,
            })

            router.refresh()
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to simulate request",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button onClick={handleSimulate} disabled={isLoading}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {isLoading ? "Simulating..." : "Simulate Incoming Request"}
        </Button>
    )
}
