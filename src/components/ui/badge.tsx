
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/90 text-primary-foreground hover:bg-primary",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        destructive:
          "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20 dark:bg-destructive/20",
        outline: "text-foreground hover:bg-accent/50",
        success: 
          "border-transparent bg-oliveGreen/15 text-oliveGreen hover:bg-oliveGreen/20 dark:bg-oliveGreen/20",
        soft: 
          "border-transparent bg-roseGold/20 text-deepNavy hover:bg-roseGold/30",
        warm: 
          "border-transparent bg-mutedPeach/40 text-primary hover:bg-mutedPeach/50",
        open:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        inProgress:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        completed:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
