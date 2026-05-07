import React from 'react';

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const { className = '', ...rest } = props;
  return (
    <textarea 
      {...rest} 
      className={`px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${className}`} 
    />
  );
};

export default Textarea;
