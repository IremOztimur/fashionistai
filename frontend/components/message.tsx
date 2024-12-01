import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  content: string
  isBot?: boolean
  timestamp?: string
}

export function ChatMessage({ content, isBot = false, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex gap-3 mb-4", !isBot && "flex-row-reverse")}>
      <Avatar>
        <AvatarFallback>{isBot ? 'AI' : 'You'}</AvatarFallback>
      </Avatar>
      <div className={cn(
        "rounded-lg p-4 max-w-[80%]",
        isBot ? "bg-muted" : "bg-blue-600 text-white"
      )}>
        <p className="text-sm">{content}</p>
        {timestamp && (
          <time className="text-xs opacity-70 mt-1 block">
            {timestamp}
          </time>
        )}
      </div>
    </div>
  )
}

