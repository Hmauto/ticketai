import { TicketPriority } from "@/types"
import { cn } from "@/lib/utils"
import { AlertCircle, AlertTriangle, ArrowDown, Minus } from "lucide-react"

interface PriorityBadgeProps {
  priority: TicketPriority
  className?: string
  showIcon?: boolean
}

const priorityConfig: Record<TicketPriority, { label: string; className: string; icon: React.ReactNode }> = {
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    icon: <ArrowDown className="w-3 h-3" />,
  },
  medium: {
    label: "Medium",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    icon: <Minus className="w-3 h-3" />,
  },
  high: {
    label: "High",
    className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    icon: <AlertCircle className="w-3 h-3" />,
  },
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  )
}
