import { ResponseSuggestion } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Copy, Check } from "lucide-react"
import { useState } from "react"

interface ResponseSuggestionCardProps {
  suggestion: ResponseSuggestion
  onUse: (content: string) => void
}

export function ResponseSuggestionCard({ suggestion, onUse }: ResponseSuggestionCardProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'template': return 'Template Match'
      case 'ai_generated': return 'AI Generated'
      case 'kb_article': return 'Knowledge Base'
      default: return 'AI Suggestion'
    }
  }
  
  return (
    <Card className="border-dashed border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">{getSourceLabel(suggestion.source)}</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(suggestion.confidence * 100)}% match
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm bg-muted p-3 rounded-md">
          {suggestion.content}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onUse(suggestion.content)}
          >
            Use This Response
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
