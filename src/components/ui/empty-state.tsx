
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "premium" | "action"
  }
  className?: string
  illustration?: React.ReactNode
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className,
  illustration 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center space-y-4",
      "bg-gradient-to-br from-warmBeige/30 to-softRose/10 rounded-xl border border-softRose/20",
      className
    )}>
      {illustration || (Icon && (
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-softRose/20 to-roseGold/20 animate-pulse">
          <Icon className="w-8 h-8 text-roseGold" />
        </div>
      ))}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-deepNavy">
          {title}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {description}
        </p>
      </div>
      
      {action && (
        <Button
          variant={action.variant || "premium"}
          onClick={action.onClick}
          className="mt-6 shadow-button hover:shadow-elevated transform hover:-translate-y-0.5 transition-all duration-300"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingState({ 
  title = "טוען...", 
  description = "אנא המתיני רגע", 
  className 
}: LoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center space-y-4",
      className
    )}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-roseGold/20 border-t-roseGold rounded-full animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-mutedPeach rounded-full animate-spin animate-reverse animation-delay-150" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-deepNavy animate-pulse">
          {title}
        </h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
