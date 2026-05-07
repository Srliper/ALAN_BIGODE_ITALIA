import React from 'react';

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className = '', ...rest } = props;
  return (
    <input 
      {...rest} 
      className={`px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className}`} 
    />
  );
};

export default Input;
