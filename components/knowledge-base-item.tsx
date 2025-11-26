"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingUp, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import type { KnowledgeBaseEntry } from "@/lib/types"

interface KnowledgeBaseItemProps {
    entry: KnowledgeBaseEntry
}

export function KnowledgeBaseItem({ entry }: KnowledgeBaseItemProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this entry?")) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/knowledge?id=${entry.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete entry")
            }

            toast.success("Entry deleted successfully")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete entry")
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    const sourceColors: Record<string, string> = {
        initial: "bg-blue-500",
        supervisor: "bg-green-500",
        manual: "bg-purple-500",
    }

    return (
        <div className="border rounded-lg p-4 space-y-3 hover:bg-accent transition-colors group relative">
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium flex-1 pr-8">{entry.question}</h3>
                <Badge className={sourceColors[entry.source] || "bg-gray-500"}>{entry.source}</Badge>
            </div>

            <p className="text-sm text-muted-foreground">{entry.answer}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Added {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</span>
                {entry.usage_count > 0 && (
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Used {entry.usage_count} times
                    </div>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        </div>
    )
}
