import React from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '../../utils/cn';

interface RevealWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const RevealWrapper: React.FC<RevealWrapperProps> = ({ 
  children, 
  delay = 0, 
  className 
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  // STRICT MOTION RULES
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: delay 
      } 
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn("w-full h-full", className)}
    >
      {children}
    </motion.div>
  );
};
