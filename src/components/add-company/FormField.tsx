import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-black">
        {label}
        {required ? (
          <span className="text-black" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-[#666666]">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const addCompanyInputClassName =
  'w-full rounded-xl border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition placeholder:text-[#999999] focus:border-black';

export const addCompanySelectClassName = addCompanyInputClassName;

export const addCompanyTextareaClassName = `${addCompanyInputClassName} min-h-24 resize-y`;

export function fieldErrorClassName(error?: string): string {
  return error ? 'border-red-500 focus:border-red-500' : '';
}
