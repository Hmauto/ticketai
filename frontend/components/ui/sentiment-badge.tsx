import { SentimentType } from "@/types"
import { cn } from "@/lib/utils"
import { Smile, Meh, Frown, Angry } from "lucide-react"

interface SentimentBadgeProps {
  sentiment: SentimentType
  className?: string
  showIcon?: boolean
  confidence?: number
}

const sentimentConfig: Record<SentimentType, { label: string; className: string; icon: React.ReactNode }> = {
  positive: {
    label: "Positive",
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    icon: <Smile className="w-3 h-3" />,
  },
  neutral: {
    label: "Neutral",
    className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    icon: <Meh className="w-3 h-3" />,
  },
  negative: {
    label: "Negative",
    className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    icon: <Frown className="w-3 h-3" />,
  },
  very_negative: {
    label: "Very Negative",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    icon: <Angry className="w-3 h-3" />,
  },
}

export function SentimentBadge({ sentiment, className, showIcon = true, confidence }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment]
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
      title={confidence ? `AI Confidence: ${Math.round(confidence * 100)}%` : undefined}
    >
      {showIcon && config.icon}
      {config.label}
      {confidence !== undefined && (
        <span className="opacity-70">({Math.round(confidence * 100)}%)</span>
      )}
    </span>
  )
}
