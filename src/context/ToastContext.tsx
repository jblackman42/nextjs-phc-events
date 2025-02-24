"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast as showToast } from '@/components/ui/use-toast';
import { ToastActionElement, ToastAction } from '@/components/ui/toast';

// export type ToastVariant = 'default' | 'destructive' | 'success';
interface ToastContextType {
  addToast: ({ title, description, variant, action, actionText }: { title: string, description: string, variant?: string, action?: () => void, actionText?: string }) => void;
}


const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Array<{
    title: string;
    description: string;
    variant: string;
    action?: () => void;
    actionText?: string;
  }>>([]);

  const addToast = ({ title, description, variant = 'default', action, actionText }: { title: string, description: string, variant?: string, action?: () => void, actionText?: string }) => {
    const newToast = { title, description, variant, action, actionText };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const { title, description, variant, action, actionText } = toasts[0];
      console.log(variant);
      showToast({
        title: title,
        description: description,
        action: action ? <ToastAction altText={actionText ?? ""} onClick={action}>{actionText}</ToastAction> : undefined,
        variant: variant as "default" | "destructive" | "success" | "error" | undefined,
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
