import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} border-t-transparent border-gold rounded-full animate-spin`}
                style={{ borderColor: '#C9A227', borderTopColor: 'transparent' }}
            />
        </div>
    );
};

export default LoadingSpinner;