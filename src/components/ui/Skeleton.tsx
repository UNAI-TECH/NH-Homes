import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  count = 1
}) => {
  const baseStyles = 'animate-pulse bg-brand-light-grey border border-brand-border';

  const variants = {
    text: 'h-4 w-full rounded-md',
    rect: 'h-24 w-full rounded-lg',
    circle: 'h-10 w-10 rounded-full'
  };

  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={clsx(
            baseStyles,
            variants[variant],
            count > 1 && 'mb-3.5',
            className
          )}
        />
      ))}
    </>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex space-x-4 border-b border-brand-border pb-3">
        <Skeleton variant="text" className="h-6 w-1/4" />
        <Skeleton variant="text" className="h-6 w-1/4" />
        <Skeleton variant="text" className="h-6 w-1/4" />
        <Skeleton variant="text" className="h-6 w-1/4" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex space-x-4">
            <Skeleton variant="text" className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
