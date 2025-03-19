"use client";
import React, { useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { ToastActionElement } from '@/components/ui/toast';

const ToastClientComponent = ({ title, description, variant = 'default', action, actionText }: { title: string, description: string, variant?: string, action?: () => void, actionText?: string }) => {
  const { addToast } = useToast();

  useEffect(() => {
    if (title) {
      addToast({
        title: title,
        description: description,
        variant: variant,
        action: action,
        actionText: actionText
      });
    }
  }, []); // Empty dependency array to run only once on mount

  return null;
};

export default ToastClientComponent;
