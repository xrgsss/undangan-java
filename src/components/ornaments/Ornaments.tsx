import { useId } from 'react';
import { cn } from '../../lib/utils';

/* ==========================================================================
 *  FLORAL CORNER  ·  rangkaian bunga mawar marun, melati, & dedaunan emas
 *  Digambar sebagai vektor orisinal; dipakai di cover, penutup, dan divider.
 * ======================================================================== */

export interface FloralProps {
  className?: string;
  /** Cermin horizontal */
  mirror?: boolean;
  /** Cermin vertikal */
  flip?: boolean;
  opacity?: number;
}

export function FloralCorner({ className, mirror = false, flip = false, opacity = 1 }: FloralProps) {
  const uid = useId().replace(/:/g, '');
  const g = `fc-gold-${uid}`;
  const r1 = `fc-rose1-${uid}`;
  const r2 = `fc-rose2-${uid}`;
  const lf = `fc-leaf-${uid}`;
  const jm = `fc-jas-${uid}`;

  const transform = [
    mirror ? 'translate(460 0) scale(-1 1)' : '',
    flip ? 'translate(0 320) scale(1 -1)' : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <svg
      viewBox="0 0 460 320"
      className={cn('overflow-visible', className)}
      style={{ opacity }}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8C6E3B" />
          <stop offset="45%" stopColor="#C6A56B" />
          <stop offset="100%" stopColor="#EDD6A4" />
        </linearGradient>
        <linearGradient id={r1} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9A3B42" />
          <stop offset="55%" stopColor="#762D32" />
          <stop offset="100%" stopColor="#4A181C" />
        </linearGradient>
        <linearGradient id={r2} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B04A4F" />
          <stop offset="100%" stopColor="#5E2126" />
        </linearGradient>
        <linearGradient id={lf} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3520" />
          <stop offset="100%" stopColor="#241708" />
        </linearGradient>
        <radialGradient id={jm} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBF2" />
          <stop offset="100%" stopColor="#DFD2B8" />
        </radialGradient>
      </defs>

      <g transform={transform}>
        {/* Tangkai */}
        <g fill="none" stroke={`url(#${g})`} strokeWidth="2.4" strokeLinecap="round">
          <path d="M14 300C60 280 108 250 150 212 196 170 236 124 286 88 320 64 356 48 396 40" />
          <path d="M150 212C132 178 108 154 74 142" />
          <path d="M286 88C286 58 300 32 326 14" />
          <path d="M226 142C250 150 278 150 300 140" />
          <path d="M110 246C126 262 148 272 176 274" />
        </g>

        {/* Dedaunan */}
        <g fill={`url(#${lf})`} stroke={`url(#${g})`} strokeWidth="1.1">
          <path d="M74 142c-26-4-46 4-58 20 22 4 42 0 58-14 12-10 14-25 10-40-14 6-22 20-10 34Z" />
          <path d="M326 14c-4-22 4-38 18-48 4 20 0 36-12 48-10 10-24 12-38 8 6-12 20-18 32-8Z" />
          <path d="M300 140c14 18 14 38 4 54-12-14-16-32-10-48 6-16 20-26 36-28-2 14-14 26-30 22Z" />
          <path d="M176 274c18 8 28 24 28 42-16-8-26-22-28-38-2-16 6-32 20-40 2 16-6 30-20 36Z" />
          <path d="M228 186c20 6 34 22 36 42-18-8-30-24-32-40-2-16 6-30 20-36 2 16-8 30-24 34Z" opacity="0.9" />
          <path d="M210 46c4-20 18-34 36-38-6 18-18 32-34 36-16 4-32-2-40-16 16-2 30 6 38 18Z" opacity="0.9" />
          <path d="M60 214c-22 0-40-10-48-28 22 0 40 10 50 26 8 14 6 30-4 42-6-14-4-28 2-40Z" opacity="0.85" />
          <path d="M396 40c22-6 42 0 52 16-22 6-42 0-54-14-10-14-10-30 0-42 6 14 6 28 2 40Z" opacity="0.85" />
        </g>

        {/* Mawar */}
        <Rose x={146} y={210} scale={1} fill={`url(#${r1})`} stroke={`url(#${g})`} />
        <Rose x={286} y={88} scale={0.82} fill={`url(#${r2})`} stroke={`url(#${g})`} />
        <Rose x={56} y={262} scale={0.66} fill={`url(#${r1})`} stroke={`url(#${g})`} />
        <Rose x={370} y={60} scale={0.58} fill={`url(#${r2})`} stroke={`url(#${g})`} />

        {/* Melati */}
        <Jasmine x={214} y={152} scale={1.15} fill={`url(#${jm})`} gold="#C6A56B" />
        <Jasmine x={100} y={232} scale={0.95} fill={`url(#${jm})`} gold="#C6A56B" />
        <Jasmine x={256} y={44} scale={0.9} fill={`url(#${jm})`} gold="#C6A56B" />
        <Jasmine x={330} y={148} scale={0.8} fill={`url(#${jm})`} gold="#C6A56B" />
        <Jasmine x={196} y={288} scale={0.72} fill={`url(#${jm})`} gold="#C6A56B" />
        <Jasmine x={36} y={200} scale={0.66} fill={`url(#${jm})`} gold="#C6A56B" />

        {/* Kuncup */}
        <g fill={`url(#${r1})`} stroke={`url(#${g})`} strokeWidth="1">
          <path d="M126 118c-8-6-10-18-4-26 8-2 16 4 18 14 2 8-4 14-14 12Z" />
          <path d="M330 178c8-6 10-18 4-26-8-2-16 4-18 14-2 8 4 14 14 12Z" />
        </g>

        {/* Putik bertaburan */}
        <g fill={`url(#${g})`} opacity="0.75">
          <circle cx="72" cy="86" r="2.2" />
          <circle cx="110" cy="60" r="1.7" />
          <circle cx="182" cy="96" r="2" />
          <circle cx="360" cy="112" r="1.9" />
          <circle cx="418" cy="86" r="1.6" />
          <circle cx="300" cy="240" r="2" />
          <circle cx="248" cy="292" r="1.7" />
          <circle cx="40" cy="316" r="1.9" />
        </g>
      </g>
    </svg>
  );
}

/** Mawar berlapis — kelopak luar + spiral emas di tengah. */
function Rose({
  x,
  y,
  scale = 1,
  fill,
  stroke,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  stroke: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* kelopak luar */}
      <g fill={fill} stroke={stroke} strokeWidth="1">
        <path d="M-26 0c0-10 6-18 14-22-2 10 2 18 12 22-10 4-14 12-12 22-8-4-14-12-14-22Z" />
        <path d="M0 -26c10 0 18 6 22 14-10-2-18 2-22 12-4-10-12-14-22-12 4-8 12-14 22-14Z" />
        <path d="M26 0c0 10-6 18-14 22 2-10-2-18-12-22 10-4 14-12 12-22 8 4 14 12 14 22Z" />
        <path d="M0 26c-10 0-18-6-22-14 10 2 18-2 22-12 4 10 12 14 22 12-4 8-12 14-22 14Z" />
      </g>
      <circle r="17" fill={fill} />
      <path d="M-17 0c0-9 8-17 17-17s17 8 17 17" fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.85" />
      <path d="M-11 3c-1-8 5-15 13-15s13 5 13 11-6 12-13 12" fill="none" stroke={stroke} strokeWidth="1.3" />
      <path d="M-5 4c-1-5 3-9 8-9s8 3 8 7-4 8-8 8" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle r="2.6" fill={stroke} />
    </g>
  );
}

/** Bunga melati putih berkelopak empat. */
function Jasmine({
  x,
  y,
  scale = 1,
  fill,
  gold,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  gold: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={gold} strokeWidth="0.9">
      <path d="M0 -9C4 -5 4 5 0 9 -4 5 -4 -5 0 -9Z" fill={fill} />
      <path d="M-9 0C-5 4 5 4 9 0 5 -4 -5 -4 -9 0Z" fill={fill} />
      <path d="M-6 -6C-1 -4 1 4 6 6 1 4 -1 -4 -6 -6Z" fill={fill} />
      <path d="M6 -6C1 -4 -1 4 -6 6 -1 4 1 -4 6 -6Z" fill={fill} />
      <circle cx="0" cy="0" r="2.2" fill={gold} />
    </g>
  );
}

/* ==========================================================================
 *  ORNATE DIVIDER  ·  pembatas antar-section bergaya ukiran keraton
 * ======================================================================== */

export function OrnateDivider({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex w-full items-center justify-center gap-3 sm:gap-4', className)}>
      <svg viewBox="0 0 160 24" className="h-4 w-24 shrink-0 text-jawa-gold sm:h-5 sm:w-40" aria-hidden="true">
        <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M0 12h104" />
          <path d="M4 12c10-8 20-8 30 0-10 8-20 8-30 0Z" />
          <path d="M28 12c8-6 16-6 24 0" opacity="0.7" />
          <path d="M104 12c14-9 28-9 42 0" />
          <path d="M112 12c8-6 16-6 22 0-6 6-14 6-22 0Z" />
        </g>
        <circle cx="136" cy="12" r="2.4" fill="url(#goldGrad)" />
      </svg>

      {label ? (
        <span className="whitespace-nowrap font-cinzel text-[10px] uppercase tracking-[0.42em] text-jawa-gold sm:text-xs">
          {label}
        </span>
      ) : (
        <svg viewBox="0 0 40 40" className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" aria-hidden="true">
          <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.3">
            <path d="M20 4C12 12 12 28 20 36 28 28 28 12 20 4Z" />
            <path d="M20 9C15 15 15 25 20 31 25 25 25 15 20 9Z" opacity="0.75" />
            <circle cx="20" cy="20" r="2.6" fill="url(#goldGrad)" stroke="none" />
          </g>
        </svg>
      )}

      <svg viewBox="0 0 160 24" className="h-4 w-24 shrink-0 -scale-x-100 text-jawa-gold sm:h-5 sm:w-40" aria-hidden="true">
        <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M0 12h104" />
          <path d="M4 12c10-8 20-8 30 0-10 8-20 8-30 0Z" />
          <path d="M28 12c8-6 16-6 24 0" opacity="0.7" />
          <path d="M104 12c14-9 28-9 42 0" />
          <path d="M112 12c8-6 16-6 22 0-6 6-14 6-22 0Z" />
        </g>
        <circle cx="136" cy="12" r="2.4" fill="url(#goldGrad)" />
      </svg>
    </div>
  );
}

/* ==========================================================================
 *  BATIK PANEL  ·  latar bermotif batik dengan kontrol opasitas & jenis
 * ======================================================================== */

export function BatikPanel({
  motif = 'parang',
  className,
  opacity = 0.16,
  children,
}: {
  motif?: 'parang' | 'kawung' | 'truntum' | 'ceplok' | 'ukiran';
  className?: string;
  opacity?: number;
  children?: React.ReactNode;
}) {
  const patternId = {
    parang: 'batikParang',
    kawung: 'batikKawung',
    truntum: 'batikTruntum',
    ceplok: 'batikCeplok',
    ukiran: 'ukiranWood',
  }[motif];

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="100%" height="100%" fill={`url(#${patternId})`} color="#C6A56B" opacity={opacity} />
      </svg>
      {children}
    </div>
  );
}

/* ==========================================================================
 *  UKEL FLOURISH  ·  gulungan awan gaya wayang untuk hiasan sudut
 * ======================================================================== */

export function UkelFlourish({ className, mirror = false }: { className?: string; mirror?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 120"
      className={cn('text-jawa-gold', mirror && '-scale-x-100', className)}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        <path d="M4 92C22 92 36 78 34 60 32 44 44 32 60 36" />
        <path d="M34 60c-12-2-20-12-18-24 2-10 12-16 22-14" />
        <path d="M60 36c-4-14 4-26 18-30 12-4 24 2 28 14" />
        <path d="M106 20c10-12 26-14 38-4 10 8 12 22 4 32" />
        <path d="M148 48c14-2 26 6 28 20 2 12-6 22-18 24" />
        <path d="M158 92h56" />
        <path d="M170 100c10-6 22-6 32 0" opacity="0.7" />
        <path d="M74 62c-8 6-10 18-4 26 6 8 18 10 26 4" />
        <path d="M96 92h48" opacity="0.6" />
        <circle cx="196" cy="92" r="3" fill="currentColor" stroke="none" />
        <circle cx="96" cy="92" r="2.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/* ==========================================================================
 *  CORNER FRAME  ·  sudut bingkai berukir emas
 * ======================================================================== */

export type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

export function CornerFrame({
  position,
  className,
  size = 84,
}: {
  position: CornerPosition;
  className?: string;
  size?: number;
}) {
  const rotation = { tl: 0, tr: 90, br: 180, bl: 270 }[position];
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('pointer-events-none absolute text-jawa-gold', className)}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <g fill="none" stroke="url(#goldGrad)" strokeLinecap="round">
        <path d="M2 2h96" strokeWidth="1.2" />
        <path d="M2 2v96" strokeWidth="1.2" />
        <path d="M10 10h56" strokeWidth="0.9" opacity="0.7" />
        <path d="M10 10v56" strokeWidth="0.9" opacity="0.7" />
        <path d="M18 18c14 0 26 10 26 24" strokeWidth="1.1" />
        <path d="M18 18c0 14 10 26 24 26" strokeWidth="1.1" />
        <path d="M30 30c8-8 20-10 30-4" strokeWidth="0.9" opacity="0.75" />
        <path d="M30 30c-8 8-10 20-4 30" strokeWidth="0.9" opacity="0.75" />
        <path d="M44 44c6-6 14-8 22-6" strokeWidth="0.8" opacity="0.55" />
        <path d="M44 44c-6 6-8 14-6 22" strokeWidth="0.8" opacity="0.55" />
      </g>
      <circle cx="46" cy="46" r="3.2" fill="url(#goldGrad)" />
      <g fill="url(#goldGrad)" opacity="0.9">
        <circle cx="66" cy="24" r="1.8" />
        <circle cx="24" cy="66" r="1.8" />
      </g>
    </svg>
  );
}

/* ==========================================================================
 *  GUNUNGAN EMBLEM  ·  medali kecil untuk monogram & favicon
 * ======================================================================== */

export function MonogramFrame({
  children,
  className,
  size = 200,
}: {
  children?: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-jawa-gold" aria-hidden="true">
        {/* gunungan bersegi delapan */}
        <path
          d="M100 8C124 30 152 52 168 92 182 126 178 158 152 178 128 196 72 196 48 178 22 158 18 126 32 92 48 52 76 30 100 8Z"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="1.6"
        />
        <path
          d="M100 22C120 40 142 60 155 94 166 122 162 148 141 165 122 180 78 180 59 165 38 148 34 122 45 94 58 60 80 40 100 22Z"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="1"
          opacity="0.7"
        />
        <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.1" opacity="0.85">
          <path d="M100 34v132" />
          <path d="M100 52c-12 4-20 12-24 24M100 52c12 4 20 12 24 24" />
          <path d="M100 96c-16 5-26 16-30 32M100 96c16 5 26 16 30 32" />
          <path d="M100 140c-14 4-22 12-26 22M100 140c14 4 22 12 26 22" />
        </g>
        {[46, 100, 154].map((x) => (
          <g key={x}>
            <path d={`M${x} 8 l6 -8 6 8 -6 8Z`} fill="url(#goldGrad)" opacity={x === 100 ? 1 : 0.8} />
            <path d={`M${x} 192 l6 8 6 -8 -6 -8Z`} fill="url(#goldGrad)" opacity={x === 100 ? 1 : 0.8} />
          </g>
        ))}
        <path d="M8 100 l-8 -6 8 -6 8 6Z" fill="url(#goldGrad)" opacity="0.8" />
        <path d="M192 100 l8 -6 -8 -6 -8 6Z" fill="url(#goldGrad)" opacity="0.8" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ==========================================================================
 *  KETUPAT / WAYANG SILHOUETTE  ·  untuk transisi "wayang melintas"
 * ======================================================================== */

export function WayangLintasan({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 400 200" className={cn('text-jawa-gold', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`lint-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C6A56B" stopOpacity="0" />
          <stop offset="50%" stopColor="#F4E0B9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C6A56B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="100" rx="200" ry="90" fill={`url(#lint-${uid})`} opacity="0.5" />
    </svg>
  );
}
