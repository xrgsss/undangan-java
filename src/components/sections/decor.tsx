import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/** Latar batik berlapis untuk panel & kartu. */
export function BatikBackdrop({
  opacity = 0.08,
  motif = 'parang',
  className,
}: {
  opacity?: number;
  motif?: 'parang' | 'kawung' | 'truntum' | 'ceplok' | 'ukiran';
  className?: string;
}) {
  const id = {
    parang: 'batikParang',
    kawung: 'batikKawung',
    truntum: 'batikTruntum',
    ceplok: 'batikCeplok',
    ukiran: 'ukiranWood',
  }[motif];

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100%" height="100%" fill={`url(#${id})`} color="#C6A56B" opacity={opacity} />
    </svg>
  );
}

/** Bingkai dengan empat sudut berukir emas. */
export function CornFrameWrap({
  children,
  className,
  size = 'md',
}: {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim = { sm: 'h-6 w-6', md: 'h-9 w-9', lg: 'h-12 w-12' }[size];
  const off = { sm: '-top-1.5 -left-1.5', md: '-top-2 -left-2', lg: '-top-3 -left-3' }[size];

  return (
    <div className={cn('relative', className)}>
      <span className={cn('pointer-events-none absolute z-10 border-l-2 border-t-2 border-jawa-gold/70', dim, off)} />
      <span className={cn('pointer-events-none absolute z-10 border-r-2 border-t-2 border-jawa-gold/70', dim, off.replace('-left', '-right'))} />
      <span className={cn('pointer-events-none absolute z-10 border-b-2 border-l-2 border-jawa-gold/70', dim, off.replace('-top', '-bottom'))} />
      <span
        className={cn(
          'pointer-events-none absolute z-10 border-b-2 border-r-2 border-jawa-gold/70',
          dim,
          off.replace('-top', '-bottom').replace('-left', '-right'),
        )}
      />
      {children}
    </div>
  );
}

/** Garis dekoratif horizontal bergaya ukiran. */
export function EngravedRule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 12" className={cn('h-3 w-full text-jawa-gold', className)} aria-hidden="true">
      <g fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round">
        <path d="M0 6h150M250 6h150" />
        <path d="M162 6c8-6 16-6 24 0-8 6-16 6-24 0Z" />
        <path d="M214 6c8-6 16-6 24 0-8 6-16 6-24 0Z" />
        <circle cx="200" cy="6" r="3" fill="url(#goldGrad)" stroke="none" />
      </g>
    </svg>
  );
}
