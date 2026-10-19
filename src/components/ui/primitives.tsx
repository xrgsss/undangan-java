import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '../../lib/utils';
import { OrnateDivider } from '../ornaments/Ornaments';

/* ==========================================================================
 *  REVEAL  ·  muncul saat masuk viewport (fade + slide-up, staggered)
 * ======================================================================== */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

/** Teks yang muncul huruf demi huruf / kata demi kata. */
export function StaggerText({
  text,
  className,
  as = 'h2',
  delay = 0,
  splitBy = 'word',
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  splitBy?: 'word' | 'char';
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const parts = splitBy === 'word' ? text.split(' ') : Array.from(text);

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: splitBy === 'word' ? 0.075 : 0.028, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {parts.map((part, i) => (
        <motion.span
          key={`${part}-${i}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {part}
          {splitBy === 'word' && i < parts.length - 1 ? '\u00A0' : null}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ==========================================================================
 *  SECTION SHELL  ·  pembungkus section dengan ornamen & pembatas
 * ======================================================================== */

export interface SectionShellProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Lebar konten maksimum */
  width?: 'narrow' | 'default' | 'wide';
  /** Tampilkan pembatas ukiran di atas judul */
  divider?: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Ornamen latar */
  motif?: 'parang' | 'kawung' | 'truntum' | 'ceplok' | 'ukiran' | 'none';
  motifOpacity?: number;
}

export function SectionShell({
  id,
  children,
  className,
  width = 'default',
  divider = true,
  eyebrow,
  title,
  subtitle,
  motif = 'truntum',
  motifOpacity = 0.07,
}: SectionShellProps) {
  const maxW = { narrow: 'max-w-xl', default: 'max-w-3xl', wide: 'max-w-6xl' }[width];

  return (
    <section id={id} className={cn('relative scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28', className)}>
      {motif !== 'none' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <rect
              width="100%"
              height="100%"
              fill={`url(#batik${
                { parang: 'Parang', kawung: 'Kawung', truntum: 'Truntum', ceplok: 'Ceplok', ukiran: 'ukiranWood' }[motif]
              })`}
              color="#C6A56B"
              opacity={motifOpacity}
            />
          </svg>
        </div>
      )}

      <div className={cn('relative mx-auto', maxW)}>
        {(eyebrow || title) && (
          <Reveal className="mb-10 text-center sm:mb-14">
            {divider && <OrnateDivider className="mb-6" />}
            {eyebrow && (
              <p className="mb-3 font-cinzel text-[10px] uppercase tracking-[0.45em] text-jawa-gold sm:text-xs">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-cinzeldec text-3xl leading-tight text-jawa-ivory sm:text-4xl md:text-[2.75rem]">
                <span className="text-gold-gradient">{title}</span>
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-xl font-serif text-base italic leading-relaxed text-jawa-beige/80 sm:text-lg">
                {subtitle}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* ==========================================================================
 *  TOMBOL
 * ======================================================================== */

export function GoldButton({
  children,
  onClick,
  href,
  className,
  variant = 'solid',
  size = 'md',
  type = 'button',
  disabled,
  ariaLabel,
  target,
  rel,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
  target?: string;
  rel?: string;
}) {
  const sizes = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
  }[size];

  const variants = {
    solid:
      'bg-gradient-to-br from-[#E8CE93] via-[#C6A56B] to-[#8C6E3B] text-jawa-chocolate shadow-[0_10px_30px_-8px_rgba(198,165,107,0.65)] hover:shadow-[0_16px_40px_-8px_rgba(198,165,107,0.85)]',
    outline:
      'border border-jawa-gold/60 bg-jawa-chocolate/40 text-jawa-goldlight backdrop-blur hover:border-jawa-gold hover:bg-jawa-gold/10',
    ghost: 'text-jawa-goldlight hover:bg-jawa-gold/10',
  }[variant];

  const base = cn(
    'gold-sheen group inline-flex items-center justify-center gap-2 rounded-full font-cinzel font-semibold uppercase tracking-[0.22em] transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-jawa-espresso',
    'active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
    sizes,
    variants,
    className,
  );

  if (href) {
    return (
      <a href={href} className={base} aria-label={ariaLabel} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* ==========================================================================
 *  KARTU
 * ======================================================================== */

export function RoyalCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'glass-royal-card relative rounded-2xl p-6 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.85)]',
        hover && 'glass-royal-card-hover',
        className,
      )}
    >
      {/* sudut berukir */}
      <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l border-t border-jawa-gold/45" />
      <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r border-t border-jawa-gold/45" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b border-l border-jawa-gold/45" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b border-r border-jawa-gold/45" />
      {children}
    </div>
  );
}

/* ==========================================================================
 *  PILL / LABEL KECIL
 * ======================================================================== */

export function GoldPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-jawa-gold/40 bg-jawa-gold/10 px-3 py-1 font-cinzel text-[10px] uppercase tracking-[0.28em] text-jawa-goldlight',
        className,
      )}
    >
      {children}
    </span>
  );
}
