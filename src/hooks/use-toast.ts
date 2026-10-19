import { useEffect, useState } from 'react';

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant?: 'destructive';
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((l) => l(toasts));

export function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function toast({ title, description, variant }: Omit<ToastItem, 'id'>) {
  const id = nextId++;
  toasts = [...toasts, { id, title, description, variant }].slice(-3);
  emit();
  setTimeout(() => dismiss(id), 5000);
}

export function useToasts() {
  const [state, setState] = useState(toasts);
  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return state;
}

export default toast;
