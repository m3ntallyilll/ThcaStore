import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { ToastMessage } from '@/lib/types';

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (message: string, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = { id, message, type, duration };
    
    set(state => ({ toasts: [...state.toasts, toast] }));
    
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  
  removeToast: (id: string) => {
    set(state => ({ toasts: state.toasts.filter(toast => toast.id !== id) }));
  },
}));

export const useToast = () => {
  const { addToast } = useToastStore();
  
  return {
    toast: (message: string, type?: ToastMessage['type']) => addToast(message, type),
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    warning: (message: string) => addToast(message, 'warning'),
    info: (message: string) => addToast(message, 'info'),
  };
};

const getToastIcon = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'error':
      return <AlertCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <Info className="w-5 h-5" />;
  }
};

const getToastStyles = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-blue-500 text-white';
  }
};

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`${getToastStyles(toast.type)} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}
          >
            {getToastIcon(toast.type)}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
