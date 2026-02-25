"use client"

import { TicketCard } from "@/components/ui/ticket-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { useState } from "react"
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types"
import Link from "next/link"

// Mock tickets data
const mockTickets: Ticket[] = [
  {
    id: "1",
    tenantId: "t1",
    subject: "Cannot access my account after password reset",
    body: "I tried resetting my password but I'm still unable to log in. It keeps saying invalid credentials even though I'm using the new password.",
    status: "open",
    priority: "high",
    category: "technical",
    sentiment: "negative",
    confidence: 0.92,
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    source: "email",
    createdAt: "2026-02-24T10:30:00Z",
    updatedAt: "2026-02-24T10:30:00Z",
    assignedToUser: undefined,
  },
  {
    id: "2",
    tenantId: "t1",
    subject: "Billing issue - charged twice this month",
    body: "I noticed on my credit card statement that I was charged twice for my subscription this month. Please refund the duplicate charge.",
    status: "in_progress",
    priority: "urgent",
    category: "billing",
    sentiment: "negative",
    confidence: 0.95,
    customerEmail: "sarah.smith@company.com",
    customerName: "Sarah Smith",
    source: "email",
    createdAt: "2026-02-24T09:15:00Z",
    updatedAt: "2026-02-24T11:20:00Z",
    assignedToUser: { id: "u1", email: "agent1@test.com", name: "Mike Johnson", role: "agent", isActive: true, createdAt: "" },
  },
  {
    id: "3",
    tenantId: "t1",
    subject: "Feature request: Dark mode support",
    body: "It would be great if you could add a dark mode option to the dashboard. Working late at night would be much easier on the eyes.",
    status: "open",
    priority: "low",
    category: "feature_request",
    sentiment: "positive",
    confidence: 0.88,
    customerEmail: "alex.dev@tech.io",
    customerName: "Alex Developer",
    source: "webhook",
    createdAt: "2026-02-23T16:45:00Z",
    updatedAt: "2026-02-23T16:45:00Z",
    assignedToUser: undefined,
  },
  {
    id: "4",
    tenantId: "t1",
    subject: "Bug: Export function not working",
    body: "When I try to export my data to CSV, nothing happens. I've tried different browsers and cleared my cache.",
    status: "in_progress",
    priority: "high",
    category: "bug",
    sentiment: "neutral",
    confidence: 0.91,
    customerEmail: "maria.garcia@business.com",
    customerName: "Maria Garcia",
    source: "email",
    createdAt: "2026-02-23T14:20:00Z",
    updatedAt: "2026-02-24T08:30:00Z",
    assignedToUser: { id: "u2", email: "agent2@test.com", name: "Sarah Chen", role: "agent", isActive: true, createdAt: "" },
  },
  {
    id: "5",
    tenantId: "t1",
    subject: "Question about API rate limits",
    body: "Hi, could you clarify what the rate limits are for the API? We're planning to increase our usage and want to make sure we stay within limits.",
    status: "resolved",
    priority: "medium",
    category: "technical",
    sentiment: "neutral",
    confidence: 0.85,
    customerEmail: "tech@startup.io",
    customerName: "Tech Team",
    source: "email",
    createdAt: "2026-02-22T11:00:00Z",
    updatedAt: "2026-02-23T15:30:00Z",
    resolvedAt: "2026-02-23T15:30:00Z",
    assignedToUser: { id: "u1", email: "agent1@test.com", name: "Mike Johnson", role: "agent", isActive: true, createdAt: "" },
  },
  {
    id: "6",
    tenantId: "t1",
    subject: "Need to update billing information",
    body: "Our company credit card expired and we need to update the billing information to avoid service interruption.",
    status: "pending",
    priority: "medium",
    category: "billing",
    sentiment: "neutral",
    confidence: 0.89,
    customerEmail: "finance@enterprise.com",
    customerName: "Finance Dept",
    source: "email",
    createdAt: "2026-02-22T09:30:00Z",
    updatedAt: "2026-02-22T14:15:00Z",
    assignedToUser: { id: "u3", email: "agent3@test.com", name: "Emily Davis", role: "agent", isActive: true, createdAt: "" },
  },
  {
    id: "7",
    tenantId: "t1",
    subject: "Integration with Salesforce",
    body: "Do you have plans to add a native Salesforce integration? This would be very helpful for our sales team.",
    status: "open",
    priority: "low",
    category: "feature_request",
    sentiment: "positive",
    confidence: 0.82,
    customerEmail: "sales@corp.com",
    customerName: "Sales Manager",
    source: "api",
    createdAt: "2026-02-21T13:20:00Z",
    updatedAt: "2026-02-21T13:20:00Z",
    assignedToUser: undefined,
  },
  {
    id: "8",
    tenantId: "t1",
    subject: "Urgent: System downtime affecting our customers",
    body: "Our customers are reporting that they cannot access the service. This is critical for our business operations.",
    status: "in_progress",
    priority: "urgent",
    category: "technical",
    sentiment: "negative",
    confidence: 0.96,
    customerEmail: "cto@urgent.com",
    customerName: "CTO Office",
    source: "email",
    createdAt: "2026-02-24T12:00:00Z",
    updatedAt: "2026-02-24T12:05:00Z",
    assignedToUser: { id: "u2", email: "agent2@test.com", name: "Sarah Chen", role: "agent", isActive: true, createdAt: "" },
  },
]

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">("all")
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.body.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    )
  }

  const toggleAllSelection = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id))
    }
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tickets</h1>
            <p className="text-muted-foreground">
              Manage and respond to customer support tickets
            </p>
          </div>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TicketStatus | "all")}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TicketPriority | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as TicketCategory | "all")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTickets.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedTickets.length} selected</span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline">Assign</Button>
              <Button size="sm" variant="outline">Change Status</Button>
              <Button size="sm" variant="outline">Change Priority</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        )}

        {/* Tickets Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="relative group">
              <div className="absolute top-3 left-3 z-10">
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={() => toggleTicketSelection(ticket.id)}
                />
              </div>
              <Link href={`/tickets/${ticket.id}`}>
                <TicketCard 
                  ticket={ticket}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No tickets found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTickets.length} of {mockTickets.length} tickets
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
    </div>
  )
}
