
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-button hover:shadow-elevated transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] hover:brightness-110 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent/50 hover:text-accent-foreground hover:border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-roseGold/20 text-deepNavy hover:bg-roseGold/30 hover:shadow-md",
        warm: "bg-mutedPeach/40 text-primary hover:bg-mutedPeach/60 hover:shadow-md",
        success: "bg-oliveGreen text-white hover:bg-oliveGreen/90 hover:shadow-lg",
        back: "bg-softGray text-muted-foreground hover:bg-softGray/80 pr-3 pl-2",
        filter: "bg-transparent border hover:bg-accent/20",
        remind: "bg-accent/10 text-primary hover:bg-accent/30 text-xs px-3 py-1.5 h-auto",
        premium: "bg-gradient-to-r from-roseGold via-mutedPeach to-roseGold text-deepNavy hover:from-roseGold/90 hover:via-mutedPeach/90 hover:to-roseGold/90 shadow-elevated hover:shadow-hover",
        action: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-button hover:shadow-elevated",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 py-2",
        lg: "h-12 rounded-xl px-8 py-3 text-base",
        icon: "h-10 w-10 rounded-full",
        xs: "h-7 text-xs px-3 py-1 rounded-lg",
        touch: "h-12 px-6 py-3 text-base min-w-[44px]", // Mobile-optimized touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  success?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, success = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Handle loading and success states
    const isDisabled = disabled || loading
    const currentVariant = success ? "success" : variant
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant: currentVariant, size, className }),
          loading && "cursor-wait",
          success && "animate-pulse",
          "group"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <span className={cn("transition-opacity duration-200", loading && "opacity-0")}>
          {children}
        </span>
        {success && (
          <span className="absolute inset-0 flex items-center justify-center">
            ✓
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
