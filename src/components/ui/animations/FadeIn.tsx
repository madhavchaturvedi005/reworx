
import React from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  as?: React.ElementType;
}

const FadeIn = ({
  children,
  className,
  delay = 0,
  duration = 700,
  as: Component = 'div',
}: FadeInProps) => {
  return (
    <Component
      className={cn('animate-fade-in', className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </Component>
  );
};

export default FadeIn;
