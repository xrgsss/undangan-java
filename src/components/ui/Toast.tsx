import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

type ToastTone = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastApi {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TONE_STYLE: Record<ToastTone, { ring: string; icon: ReactNode }> = {
  success: {
    ring: 'border-jawa-gold/60 bg-jawa-espresso/95',
    icon: <Check size={15} className="text-emerald-300" />,
  },
  error: {
    ring: 'border-jawa-maroonlight/60 bg-jawa-espresso/95',
    icon: <TriangleAlert size={15} className="text-jawa-maroonlight" />,
  },
  info: {
    ring: 'border-jawa-gold/40 bg-jawa-espresso/95',
    icon: <Info size={15} className="text-jawa-gold" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[95] flex flex-col items-center gap-2 px-4 sm:bottom-8"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto flex max-w-sm items-center gap-3 rounded-full border px-4 py-2.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md',
                TONE_STYLE[t.tone].ring,
              )}
            >
              {TONE_STYLE[t.tone].icon}
              <span className="font-serif text-sm text-jawa-ivory">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
