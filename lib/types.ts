export type HelpRequestStatus = "pending" | "resolved" | "timeout"

export interface HelpRequest {
  id: string
  caller_phone: string
  caller_name: string | null
  question: string
  context: string | null
  room_name: string | null
  status: HelpRequestStatus
  supervisor_answer: string | null
  created_at: string
  resolved_at: string | null
  timeout_at: string | null
}

export interface KnowledgeBaseEntry {
  id: string
  question: string
  answer: string
  source: "supervisor" | "manual" | "initial"
  help_request_id: string | null
  created_at: string
  updated_at: string
  usage_count: number
}

export interface CallLog {
  id: string
  caller_phone: string
  caller_name: string | null
  call_duration: number | null
  conversation_summary: string | null
  escalated: boolean
  help_request_id: string | null
  created_at: string
}
