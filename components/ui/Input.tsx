import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    multiline?: boolean; // if true, renders a textarea
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    multiline = false,
    id,
    className = '',
    required,
    ...props
}) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    const baseClasses = 'w-full bg-dark-bg text-cream border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition duration-200';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
        <div className="mb-4">
            <label htmlFor={inputId} className="block text-sm font-medium text-cream mb-1">
                {label}{required && <span className="text-gold ml-1">*</span>}
            </label>
            {multiline ? (
                <textarea
                    id={inputId}
                    className={combinedClasses}
                    rows={4}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            ) : (
                <input
                    id={inputId}
                    className={combinedClasses}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;