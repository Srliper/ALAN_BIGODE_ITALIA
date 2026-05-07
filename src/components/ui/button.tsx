import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  disabled?: boolean;
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:opacity-90',
  outline: 'border border-border bg-transparent hover:bg-secondary',
  ghost: 'bg-transparent hover:bg-secondary',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
};

export const Button = ({ 
  children, 
  className = '', 
  size = 'md', 
  variant = 'default',
  disabled = false,
  ...rest 
}: Props) => (
  <button 
    {...rest} 
    disabled={disabled}
    className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-md transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export default Button;
