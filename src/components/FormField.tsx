import React from 'react';
import { cn, textareaFitClasses } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    isTextArea?: boolean;
    required?: boolean;
}

export default function FormField({
    label,
    error,
    isTextArea = false,
    required = false,
    className,
    ...props
}: FormFieldProps) {
    const Component = isTextArea ? 'textarea' : 'input';

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-sm font-bold text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <Component
                className={cn(
                    "w-full min-w-0 px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium",
                    error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "",
                    isTextArea ? cn("min-h-[120px]", textareaFitClasses) : ""
                )}
                {...props as any}
            />
            {error && (
                <p className="text-sm font-bold text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
