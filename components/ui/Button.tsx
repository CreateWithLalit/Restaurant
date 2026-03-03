import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'rounded font-medium transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-gold text-dark hover:opacity-90 focus:ring-gold',
        outline: 'bg-transparent border border-gold text-cream hover:opacity-80 focus:ring-gold',
        danger: 'bg-red-600 text-white hover:opacity-90 focus:ring-red-500',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-7 py-3.5 text-lg',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button className={classes} disabled={disabled} {...props}>
            {children}
        </button>
    );
};

export default Button;