import React from 'react';

export const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  const { className = '', children, ...rest } = props as any;
  return (
    <label {...rest} className={`block text-sm font-medium ${className}`}>
      {children}
    </label>
  );
};

export default Label;
