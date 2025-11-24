import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-army-green/30 bg-card/50 backdrop-blur-sm px-3 py-2 text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-army-green focus-visible:ring-2 focus-visible:ring-army-green/20 focus-visible:bg-card/70 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 [&:-webkit-autofill]:!bg-card/50 [&:-webkit-autofill]:!text-foreground [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_hsl(var(--card)/0.5)_inset]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
