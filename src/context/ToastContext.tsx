"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast as showToast } from '@/components/ui/use-toast';
import { ToastActionElement, ToastAction } from '@/components/ui/toast';

interface ToastContextType {
  addToast: (message: string, variant?: 'default' | 'destructive', action?: ToastActionElement) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Array<{ message: string, variant: 'default' | 'destructive', action: ToastActionElement | null }>>([]);

  const addToast = (message: string, variant: 'default' | 'destructive' = 'default', action: ToastActionElement | null = null) => {
    setToasts(prevToasts => [...prevToasts, { message, variant, action }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const { message, variant, action } = toasts[0];
      showToast({
        title: "Uh oh! Something went wrong.",
        description: message,
        action: action ?? <ToastAction altText="Try Again" onClick={() => window.location.reload()}>Try Again</ToastAction>,
        variant: variant,
      });
      setToasts(prevToasts => prevToasts.slice(1));
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
