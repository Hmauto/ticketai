import { Ticket } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"
import { PriorityBadge } from "./priority-badge"
import { CategoryBadge } from "./category-badge"
import { SentimentBadge } from "./sentiment-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatRelativeTime, truncate, getInitials } from "@/lib/utils"
import { Mail, Clock } from "lucide-react"

interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
  selected?: boolean
}

export function TicketCard({ ticket, onClick, selected }: TicketCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">
              {ticket.subject}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {truncate(ticket.body, 120)}
            </p>
          </div>
          <PriorityBadge priority={ticket.priority} showIcon={false} />
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <StatusBadge status={ticket.status} />
          <CategoryBadge category={ticket.category} showIcon={false} />
          <SentimentBadge sentiment={ticket.sentiment} showIcon={false} />
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {ticket.customerEmail}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {ticket.assignedToUser ? (
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-[10px]">
                  {getInitials(ticket.assignedToUser.name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(ticket.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
