"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { CategoryBadge } from "@/components/ui/category-badge"
import { SentimentBadge } from "@/components/ui/sentiment-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  MoreHorizontal,
  User,
  Clock,
  Tag,
  Sparkles,
  MessageSquare,
  Lock
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { formatDateTime, getInitials } from "@/lib/utils"
import { Ticket, TicketStatus, TicketPriority, TicketCategory, SentimentType } from "@/types"

// Mock ticket data
const mockTicket: Ticket = {
  id: "1",
  tenantId: "t1",
  subject: "Cannot access my account after password reset",
  body: "I tried resetting my password but I'm still unable to log in...",
  status: "open" as TicketStatus,
  priority: "high" as TicketPriority,
  category: "technical" as TicketCategory,
  sentiment: "negative" as SentimentType,
  confidence: 0.92,
  customerEmail: "john.doe@example.com",
  customerName: "John Doe",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  source: "email",
}

const mockSuggestions = [
  {
    id: "s1",
    content: "I understand your frustration. Let me help you troubleshoot this login issue...",
    confidence: 0.89,
    source: "template"
  },
  {
    id: "s2", 
    content: "Thank you for reaching out. I'll reset your account completely...",
    confidence: 0.76,
    source: "ai"
  }
]

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [reply, setReply] = useState("")
  const [activeTab, setActiveTab] = useState("public")
  const [ticket, setTicket] = useState(mockTicket)

  const handleSendReply = () => {
    if (!reply.trim()) return
    setReply("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tickets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold truncate">{ticket.subject}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>#{ticket.id}</span>
            <span>•</span>
            <span>{formatDateTime(ticket.createdAt)}</span>
          </div>
        </div>
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Actions
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Classification */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Classification</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Confidence: {Math.round(ticket.confidence * 100)}%
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={ticket.category} />
                <PriorityBadge priority={ticket.priority} />
                <SentimentBadge sentiment={ticket.sentiment} />
              </div>
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Original Message */}
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(ticket.customerName || "Customer")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{ticket.customerName || ticket.customerEmail}</span>
                      <span className="text-muted-foreground text-sm ml-2">{ticket.customerEmail}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(ticket.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{ticket.body}</div>
                </div>
              </div>

              <Separator />

              {/* Reply Composer */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="public">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Public Reply
                  </TabsTrigger>
                  <TabsTrigger value="internal">
                    <Lock className="h-4 w-4 mr-2" />
                    Internal Note
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="public" className="space-y-4">
                  <Textarea
                    placeholder="Write your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                    <Button onClick={handleSendReply}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Response Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 border rounded-lg hover:bg-muted cursor-pointer" onClick={() => setReply(suggestion.content)}>
                  <p className="text-sm line-clamp-3">{suggestion.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{Math.round(suggestion.confidence * 100)}% match</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <div className="mt-1"><StatusBadge status={ticket.status} /></div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Assignee</label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{ticket.assignedToUser?.name || "Unassigned"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    <SelectItem value="u1">Mike Johnson</SelectItem>
                    <SelectItem value="u2">Sarah Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDateTime(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Source:</span>
                  <span className="capitalize">{ticket.source}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
