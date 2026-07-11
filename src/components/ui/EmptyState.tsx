import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi2';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items matching the criteria or none have been created yet.',
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-brand-border rounded-xl shadow-xs">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-light-grey text-brand-dark-grey mb-4">
        {icon || <HiOutlineInbox className="h-6 w-6 text-brand-dark-grey" />}
      </div>
      <h3 className="text-sm font-semibold text-brand-text mb-1">{title}</h3>
      <p className="text-xs text-brand-dark-grey max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
