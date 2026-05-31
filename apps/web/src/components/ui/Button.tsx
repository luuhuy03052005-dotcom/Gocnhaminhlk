import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'goka';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  href?: string;
  target?: string;
  as?: React.ElementType;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, as, href, target, children, ...props }, ref) => {
    const Component: React.ElementType = as || (href ? 'a' : 'button');
    
    // STRICT COMMERCIAL CLEAN STYLES
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#C8873A] text-white hover:bg-[#2C2017]",
      secondary: "bg-[#2C2017] text-[#FFFFFF] hover:bg-[#C8873A]",
      ghost: "bg-transparent text-[#2C2017] hover:bg-[#EBE0CF]",
      goka: "bg-[#FFC107] text-[#2C2017] hover:bg-[#2C2017] hover:text-[#FFFFFF]" 
    };
    
    const sizes = {
      sm: "px-6 py-2 text-[0.75rem] h-10",
      md: "px-8 py-3 text-[0.875rem] h-12",
      lg: "px-10 py-4 text-[0.875rem] h-14"
    };

    return (
      <Component
        ref={ref}
        href={href}
        target={target}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
