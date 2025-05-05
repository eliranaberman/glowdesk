
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/20 text-destructive",
        outline:
          "text-foreground",
        success:
          "border-transparent bg-green-500/20 text-green-700 dark:text-green-300",
        warning:
          "border-transparent bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
        soft:
          "border-transparent bg-roseGold/20 text-deepNavy hover:bg-roseGold/30",
        warm:
          "border-transparent bg-mutedPeach/40 text-primary hover:bg-mutedPeach/60",
        open:
          "border-transparent bg-blue-500/20 text-blue-700 dark:text-blue-300",
        inProgress:
          "border-transparent bg-orange-500/20 text-orange-700 dark:text-orange-300",
        completed:
          "border-transparent bg-green-500/20 text-green-700 dark:text-green-300",
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
