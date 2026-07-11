import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-brand-dark-grey uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark-grey">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={clsx(
              'block w-full rounded-lg border border-brand-border py-2.5 text-sm transition-all duration-150 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-400 text-brand-text bg-white',
              leftIcon ? 'pl-10' : 'pl-3.5',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-border',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-brand-dark-grey uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'block w-full rounded-lg border border-brand-border py-2.5 px-3.5 text-sm transition-all duration-150 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white text-brand-text',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-border',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-brand-dark-grey uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'block w-full rounded-lg border border-brand-border py-2.5 px-3.5 text-sm transition-all duration-150 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white text-brand-text',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-brand-border',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
