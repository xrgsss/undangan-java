import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUp,
  CalendarDays,
  Gift,
  Heart,
  Home,
  Images,
  Landmark,
  MapPin,
  MessageSquareHeart,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Awal', icon: Home },
  { id: 'mempelai', label: 'Mempelai', icon: Heart },
  { id: 'acara', label: 'Acara', icon: CalendarDays },
  { id: 'galeri', label: 'Galeri', icon: Images },
  { id: 'adat', label: 'Adat', icon: Landmark },
  { id: 'lokasi', label: 'Lokasi', icon: MapPin },
  { id: 'rsvp', label: 'Konfirmasi', icon: ClipboardCheck },
  { id: 'ucapan', label: 'Ucapan', icon: MessageSquareHeart },
  { id: 'hadiah', label: 'Hadiah', icon: Gift },
];

/**
 * Navigasi bawah (bottom dock) bergaya kaca emas.
 *  · Menyembunyikan diri saat menggulir ke bawah, muncul kembali saat ke atas.
 *  · Menyoroti section yang sedang aktif (IntersectionObserver).
 *  · Dapat digulir horizontal di layar kecil.
 */
export function NavDock({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState('hero');
  const [hidden, setHidden] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // Sorot section aktif.
  useEffect(() => {
    if (!ready) return;
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ready]);

  // Sembunyikan saat menggulir ke bawah.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowTop(y > 700);
      if (y > last + 12) setHidden(true);
      else if (y < last - 12) setHidden(false);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Tombol ke atas */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="fixed bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-jawa-gold/50 bg-jawa-espresso/85 text-jawa-goldlight backdrop-blur transition hover:bg-jawa-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70 sm:bottom-28 sm:right-6"
            aria-label="Kembali ke atas"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ready && (
          <motion.nav
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: hidden ? 110 : 0, opacity: hidden ? 0.001 : 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-5"
            aria-label="Navigasi undangan"
          >
            <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-jawa-gold/35 bg-jawa-espresso/85 px-2 py-2 shadow-[0_-6px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={item.label}
                    title={item.label}
                    className={cn(
                      'group relative flex shrink-0 flex-col items-center gap-1 rounded-full px-3 py-1.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70',
                      isActive ? 'text-jawa-goldlight' : 'text-jawa-beige/55 hover:text-jawa-goldlight',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full border border-jawa-gold/60 bg-jawa-gold/15"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon size={16} />
                    <span className="hidden font-cinzel text-[8px] uppercase tracking-[0.18em] sm:block">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
