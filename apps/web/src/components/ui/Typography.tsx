import React from 'react';
import { cn } from '../../utils/cn';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'a';
  href?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'badge';
}

export const Typography: React.FC<TypographyProps> = ({ 
  as, 
  variant = 'body', 
  className, 
  children, 
  ...props 
}) => {
  const defaultElementByVariant: Record<NonNullable<TypographyProps['variant']>, NonNullable<TypographyProps['as']>> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    caption: 'p',
    badge: 'p',
  };
  const Component: React.ElementType = as || defaultElementByVariant[variant];

  // STRICT RULES FROM DEEP POLISH SPEC
  const variants = {
    h1: "font-serif text-5xl md:text-7xl leading-[1.1] tracking-[-0.02em] text-[#2C2017] font-semibold",
    h2: "font-serif text-4xl md:text-5xl leading-[1.2] tracking-[-0.01em] text-[#2C2017] font-semibold",
    h3: "font-serif text-3xl leading-[1.3] text-[#2C2017]",
    h4: "font-serif text-xl md:text-[1.375rem] leading-[1.4] text-[#2C2017]",
    body: "font-sans text-[1.125rem] md:text-[1.25rem] leading-[1.7] text-[#6A5A4A]",
    caption: "font-sans text-sm md:text-[0.9375rem] leading-[1.6] text-[#7A6A55]",
    badge: "font-sans text-[0.875rem] font-bold uppercase tracking-[0.1em] text-[#C8873A]"
  };

  return (
    <Component 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </Component>
  );
};
