import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryPhoto } from '../../types/invitation';
import { cn } from '../../lib/utils';

export interface LightboxProps {
  photos: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Lightbox galeri: navigasi keyboard (←/→/Esc), swipe di layar sentuh,
 * fokus terkunci, dan preload foto tetangga agar perpindahan terasa mulus.
 */
export function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + photos.length) % photos.length;
      onIndexChange(next);
    },
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, go]);

  // Preload tetangga
  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((d) => {
      const p = photos[(index + d + photos.length) % photos.length];
      if (!p) return;
      const img = new Image();
      img.src = p.src;
    });
  }, [index, photos]);

  const current = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col bg-jawa-espresso/96 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            if (!touchStart.current) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStart.current.x;
            const dy = t.clientY - touchStart.current.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
            touchStart.current = null;
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-batik-parang opacity-[0.09]" aria-hidden="true" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.36em] text-jawa-gold/80">
              {index! + 1} / {photos.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-full border border-jawa-gold/40 p-2 text-jawa-goldlight transition hover:bg-jawa-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
              aria-label="Tutup galeri"
            >
              <X size={18} />
            </button>
          </div>

          {/* Gambar */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-2 pb-4 sm:px-16">
            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-h-full w-full max-w-4xl"
              >
                <img
                  src={current.src}
                  alt={current.alt}
                  className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg border border-jawa-gold/30 object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:max-h-[74vh]"
                />
                {current.caption && (
                  <figcaption className="mt-3 text-center font-serif text-sm italic text-jawa-beige/85 sm:text-base">
                    {current.caption}
                  </figcaption>
                )}
              </motion.figure>
            </AnimatePresence>

            {/* Navigasi */}
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-jawa-gold/40 bg-jawa-espresso/70 p-2.5 text-jawa-goldlight transition hover:bg-jawa-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70 sm:left-5"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-jawa-gold/40 bg-jawa-espresso/70 p-2.5 text-jawa-goldlight transition hover:bg-jawa-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70 sm:right-5"
              aria-label="Foto berikutnya"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Thumbnail */}
          <div className="relative z-10 no-scrollbar flex gap-2 overflow-x-auto px-4 pb-5 pt-1 sm:justify-center sm:px-6">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Lihat foto ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'h-12 w-12 shrink-0 overflow-hidden rounded border transition sm:h-14 sm:w-14',
                  i === index
                    ? 'border-jawa-gold ring-2 ring-jawa-gold/40'
                    : 'border-jawa-gold/25 opacity-55 hover:opacity-100',
                )}
              >
                <img src={p.thumb ?? p.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
