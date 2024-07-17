"use client";
import React, { useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { ToastActionElement } from '@/components/ui/toast';

interface ToastClientComponentProps {
  message: string;
  variant?: 'default' | 'destructive';
  action?: ToastActionElement;
}

const ToastClientComponent: React.FC<ToastClientComponentProps> = ({ message, variant = 'default', action }) => {
  const { addToast } = useToast();

  useEffect(() => {
    if (message) {
      addToast(message, variant, action);
    }
  }, []); // Empty dependency array to run only once on mount

  return null;
};

export default ToastClientComponent;
