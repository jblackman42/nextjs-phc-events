import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground border border-2 border-accent",
        thin: "bg-primary hover:bg-accent hover:text-accent-foreground border text-textHeading shadow-md",
        icon: "bg-primary text-textHeading hover:bg-accent text-xl w-10 rounded-full border border-input",
        outline: "bg-transparent border text-textHeading",
        simple: "bg-secondary text-textHeading border border-ring"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-[10px] sm:text-sm",
        lg: "h-11 rounded-md px-8"
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
