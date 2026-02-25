import { TicketCategory } from "@/types"
import { cn } from "@/lib/utils"
import { CreditCard, Wrench, Lightbulb, Bug, HelpCircle } from "lucide-react"

interface CategoryBadgeProps {
  category: TicketCategory
  className?: string
  showIcon?: boolean
}

const categoryConfig: Record<TicketCategory, { label: string; className: string; icon: React.ReactNode }> = {
  billing: {
    label: "Billing",
    className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    icon: <CreditCard className="w-3 h-3" />,
  },
  technical: {
    label: "Technical",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    icon: <Wrench className="w-3 h-3" />,
  },
  feature_request: {
    label: "Feature Request",
    className: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
    icon: <Lightbulb className="w-3 h-3" />,
  },
  bug: {
    label: "Bug",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    icon: <Bug className="w-3 h-3" />,
  },
  general: {
    label: "General",
    className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    icon: <HelpCircle className="w-3 h-3" />,
  },
}

export function CategoryBadge({ category, className, showIcon = true }: CategoryBadgeProps) {
  const config = categoryConfig[category]
  
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
