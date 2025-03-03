
import React from 'react';
import { cn } from '@/lib/utils';

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right';
  as?: React.ElementType;
}

const SlideIn = ({
  children,
  className,
  delay = 0,
  duration = 700,
  direction = 'up',
  as: Component = 'div',
}: SlideInProps) => {
  const directionClasses = {
    up: 'animate-slide-up',
    down: 'animate-slide-down',
    left: 'animate-slide-left',
    right: 'animate-slide-right',
  };

  return (
    <Component
      className={cn(directionClasses[direction], className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </Component>
  );
};

export default SlideIn;
