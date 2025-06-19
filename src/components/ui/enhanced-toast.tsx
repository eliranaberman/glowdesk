
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Info, XCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'magic'

interface EnhancedToastProps {
  type: ToastType
  title: string
  description?: string
  action?: React.ReactNode
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: "border-oliveGreen/20 bg-oliveGreen/10 text-oliveGreen",
    iconClassName: "text-oliveGreen"
  },
  error: {
    icon: XCircle,
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    iconClassName: "text-destructive"
  },
  warning: {
    icon: AlertCircle,
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    iconClassName: "text-amber-500"
  },
  info: {
    icon: Info,
    className: "border-blue-500/20 bg-blue-500/10 text-blue-700",
    iconClassName: "text-blue-500"
  },
  magic: {
    icon: Sparkles,
    className: "border-roseGold/20 bg-gradient-to-r from-roseGold/10 to-mutedPeach/10 text-deepNavy",
    iconClassName: "text-roseGold animate-pulse"
  }
}

export function useEnhancedToast() {
  const { toast } = useToast()

  const showToast = ({ type, title, description, action }: EnhancedToastProps) => {
    const config = toastConfig[type]
    const Icon = config.icon

    toast({
      title: title,
      description: (
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", config.iconClassName)} />
          <span>{description}</span>
        </div>
      ),
      className: cn(
        "border shadow-lg backdrop-blur-sm transition-all duration-300",
        config.className
      ),
    })
  }

  return {
    success: (title: string, description?: string) => 
      showToast({ type: 'success', title, description }),
    error: (title: string, description?: string) => 
      showToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) => 
      showToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) => 
      showToast({ type: 'info', title, description }),
    magic: (title: string, description?: string) => 
      showToast({ type: 'magic', title, description }),
  }
}
