
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    variant?: 'default' | 'help' | 'premium'
  }
>(({ className, sideOffset = 4, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-popover text-popover-foreground shadow-md",
    help: "bg-blue-50 text-blue-900 border border-blue-200 shadow-lg",
    premium: "bg-gradient-to-r from-roseGold/90 to-mutedPeach/90 text-deepNavy shadow-xl border border-roseGold/20"
  }

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-lg px-3 py-2 text-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 backdrop-blur-sm transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface HelpTooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "right" | "bottom" | "left"
  variant?: 'default' | 'help' | 'premium'
}

function HelpTooltip({ children, content, side = "top", variant = "help" }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} variant={variant}>
          <p className="max-w-xs text-right" dir="rtl">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, HelpTooltip }
