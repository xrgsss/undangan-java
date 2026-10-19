import { useMemo } from 'react';
import { cn } from '../../lib/utils';

/* ==========================================================================
 *  EFEK PARTIKEL  ·  kelopak bunga & bara lampu blencong
 *  CSS-only (transform + opacity) sehingga tidak membebani main thread.
 *  Jumlah partikel dibatasi & otomatis berkurang di layar kecil.
 * ======================================================================== */

interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: string;
  /** arah angin dalam piksel */
  drift?: number;
  durationRange?: [number, number];
  sizeRange?: [number, number];
}

function useParticles(
  count: number,
  durationRange: [number, number],
  sizeRange: [number, number],
  drift: number,
) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * durationRange[1],
        duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        drift: drift * (0.4 + Math.random()),
        opacity: 0.35 + Math.random() * 0.5,
        rotate: Math.random() * 360,
      })),
    // Partikel dibuat sekali saja; aman karena hanya bergantung pada konstanta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count],
  );
}

/** Kelopak bunga mawar/melati yang jatuh lembut. */
export function PetalField({
  count = 14,
  className,
  drift = 60,
  durationRange = [14, 26],
  sizeRange = [8, 18],
}: ParticleFieldProps) {
  const petals = useParticles(count, durationRange, sizeRange, drift);
  const shape = useMemo(() => ['petal', 'leaf', 'jasmine'] as const, []);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block will-change-transform"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.35,
              opacity: p.opacity,
              animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
              ['--drift' as string]: `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <PetalShape variant={shape[p.id % shape.length]} />
        </span>
      ))}
    </div>
  );
}

function PetalShape({ variant }: { variant: 'petal' | 'leaf' | 'jasmine' }) {
  if (variant === 'leaf') {
    return (
      <svg viewBox="0 0 24 32" className="h-full w-full">
        <defs>
          <linearGradient id="pl-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A3520" />
            <stop offset="100%" stopColor="#7E5F2E" />
          </linearGradient>
        </defs>
        <path d="M12 1C20 9 23 20 12 31 1 20 4 9 12 1Z" fill="url(#pl-leaf)" opacity="0.85" />
        <path d="M12 4v24" stroke="#C6A56B" strokeWidth="0.7" opacity="0.5" />
      </svg>
    );
  }
  if (variant === 'jasmine') {
    return (
      <svg viewBox="0 0 24 32" className="h-full w-full">
        <g fill="#F2E7D2" opacity="0.9">
          <ellipse cx="12" cy="16" rx="4" ry="10" />
          <ellipse cx="12" cy="16" rx="10" ry="4" />
          <ellipse cx="12" cy="16" rx="4" ry="10" transform="rotate(45 12 16)" />
        </g>
        <circle cx="12" cy="16" r="2.4" fill="#C6A56B" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 32" className="h-full w-full">
      <defs>
        <linearGradient id="pl-rose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9A3B42" />
          <stop offset="100%" stopColor="#5A1E22" />
        </linearGradient>
      </defs>
      <path d="M12 2C21 10 21 24 12 30 3 24 3 10 12 2Z" fill="url(#pl-rose)" opacity="0.9" />
      <path d="M12 6c5 5 5 14 0 19" stroke="#C6A56B" strokeWidth="0.7" fill="none" opacity="0.45" />
    </svg>
  );
}

/** Bara kecil naik dari bawah — meniru cahaya lampu blencong. */
export function EmberField({
  count = 18,
  className,
  drift = 30,
  durationRange = [10, 22],
  sizeRange = [2, 5],
}: ParticleFieldProps) {
  const embers = useParticles(count, durationRange, sizeRange, drift);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-0 block rounded-full will-change-transform"
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              background: 'radial-gradient(circle, #FFE9B0 0%, #E8A94E 55%, rgba(232,169,78,0) 100%)',
              opacity: e.opacity,
              animation: `emberRise ${e.duration}s linear ${e.delay}s infinite`,
              ['--drift' as string]: `${e.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
