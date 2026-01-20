import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-premium-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-muted hover:text-accent-foreground hover:border-secondary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-glow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 hover:shadow-glow shadow-md",
        "premium-outline": "border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-glow",
        "premium-dark": "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground hover:shadow-premium-lg shadow-md",
        gold: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 hover:shadow-gold shadow-lg font-bold",
        "hero-primary": "bg-gradient-to-r from-secondary via-secondary to-blue-500 text-secondary-foreground hover:from-secondary/90 hover:via-secondary/90 hover:to-blue-500/90 shadow-lg hover:shadow-glow-lg",
        "hero-secondary": "bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/20 hover:border-primary-foreground/50 backdrop-blur-sm",
        gradient: "bg-gradient-to-r from-secondary via-purple-500 to-accent text-white hover:shadow-glow-lg shadow-md",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-base font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
