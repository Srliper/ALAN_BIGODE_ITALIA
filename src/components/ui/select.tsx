import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type SelectContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const SelectContext = createContext<SelectContextType>({});

export const Select = ({ value, onValueChange, children }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '' }: any) => {
  const ctx = useContext(SelectContext);
  return (
    <div 
      onClick={() => ctx.setOpen?.(!ctx.open)}
      className={`w-full ${className} py-2 px-3 rounded-md border border-border bg-input cursor-pointer flex items-center justify-between`}
    >
      {children}
      <span className="text-muted-foreground">▼</span>
    </div>
  );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const ctx = useContext(SelectContext);
  const current = ctx.value;
  return <span className={current ? 'text-foreground' : 'text-muted-foreground'}>{current ?? placeholder}</span>;
};

export const SelectContent = ({ children, className = '' }: any) => {
  const ctx = useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        ctx.setOpen?.(false);
      }
    };

    if (ctx.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ctx.open]);

  if (!ctx.open) return null;

  return (
    <div 
      ref={contentRef}
      className={`${className} absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto`}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children, className = '' }: any) => {
  const ctx = useContext(SelectContext);
  const handleClick = () => {
    ctx.onValueChange?.(value);
    ctx.setOpen?.(false);
  };
  const isSelected = ctx.value === value;
  return (
    <div 
      onClick={handleClick} 
      className={`py-2 px-3 cursor-pointer hover:bg-secondary transition-colors ${isSelected ? 'bg-secondary/50 text-primary' : 'text-foreground'} ${className}`} 
      role="button" 
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default Select;
