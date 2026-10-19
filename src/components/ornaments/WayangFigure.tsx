import { useId } from 'react';
import { cn } from '../../lib/utils';

export type WayangVariant = 'arjuna' | 'srikandi';

export interface WayangFigureProps {
  variant?: WayangVariant;
  /** Cermin horizontal sehingga tokoh menghadap ke kiri */
  mirror?: boolean;
  /** Aktifkan gerak halus seperti wayang dimainkan dalang */
  animated?: boolean;
  /** Tampilkan tongkat dalang (cempurit) */
  stick?: boolean;
  /** Warna aksen ukiran; 'maroon' memberi nuansa berbeda */
  tone?: 'gold' | 'maroon' | 'ivory';
  className?: string;
  /** opacity keseluruhan, dipakai untuk bayangan wayang */
  opacity?: number;
  /** aria-hidden bila murni dekoratif */
  decorative?: boolean;
}

/* ---------------------------------------------------------------------------
 *  Path data — hasil desain vektor orisinal (lihat docs/art/wayang-*.svg)
 * ------------------------------------------------------------------------- */

/** Kipas bulu (garuda mungkur) untuk tokoh pria. */
const ARJUNA_FAN: { d: string; rotate: number }[] = [
  { d: 'M0 0C-9 -8 -34 -13 -58 0 -34 11 -9 8 0 0Z', rotate: 58 },
  { d: 'M0 0C-9 -8 -36 -13 -62 0 -36 11 -9 8 0 0Z', rotate: 35 },
  { d: 'M0 0C-9 -8 -38 -13 -66 0 -38 11 -9 8 0 0Z', rotate: 11 },
  { d: 'M0 0C-9 -8 -36 -13 -62 0 -36 11 -9 8 0 0Z', rotate: -14 },
  { d: 'M0 0C-9 -8 -33 -13 -54 0 -33 11 -9 8 0 0Z', rotate: -38 },
  { d: 'M0 0C-8 -7 -28 -11 -44 0 -28 9 -8 7 0 0Z', rotate: -60 },
];

const ARJUNA_HEAD =
  'M148 42C138 24 120 12 102 8 92 6 84 10 82 18 80 26 86 32 94 32 88 28 88 20 94 16 100 12 108 14 114 18 124 24 132 32 138 42 128 46 122 54 118 64 111 80 110 98 116 116 120 128 128 136 136 140 150 146 162 143 170 137 177 132 181 124 180 118 186 115 189 109 187 104 197 101 210 97 222 90 208 85 197 81 188 78 179 71 174 57 168 49 162 42 154 41 148 42Z';

const ARJUNA_DETAILS = [
  'M138 44C132 48 128 54 126 62',
  'M114 18C108 26 106 36 110 44',
  'M170 78c4 3 8 5 12 6',
  'M178 108c4 2 9 2 13 -1',
  'M152 88c-8 3-11 12-8 20 8-1 13-9 13-17',
  'M160 54c4 3 8 4 12 3',
];

/** Sanggul + rambut untuk tokoh putri. */
const SRIKANDI_BUN = [
  'M120 74C112 74 104 70 100 62 94 50 96 38 104 30 112 22 124 20 134 26 142 32 144 44 138 56 134 66 128 72 120 74Z',
  'M118 64C102 76 92 96 94 118 96 134 106 146 118 150 108 138 102 120 104 104 106 88 114 74 124 66Z',
  'M122 24C116 14 118 4 126 2 122 10 126 18 134 22Z',
];

const SRIKANDI_HEAD =
  'M118 118C110 100 110 78 118 60 124 46 138 38 152 40 164 42 172 52 175 64 177 73 183 79 191 85 199 91 208 95 216 96 210 102 200 102 192 102 194 107 194 111 190 114 192 118 190 122 184 124 176 129 166 131 158 128 150 133 140 133 132 128 126 125 121 121 118 118Z';

const SRIKANDI_DETAILS = [
  'M136 46C130 50 126 56 124 64',
  'M104 32c10 8 24 10 34 4',
  'M172 79c4 3 8 5 12 6',
  'M180 109c4 2 9 2 13 -1',
  'M154 89c-8 3-11 12-8 20 8-1 13-9 13-17',
  'M150 112c-4 6-4 12 0 16 4-4 4-10 0-16Z',
];

/** Bagian tubuh yang sama untuk kedua tokoh. */
const SHARED = {
  neck: 'M138 126L164 122C170 132 172 145 170 158L134 161C131 147 132 134 138 126Z',
  backArm: 'M140 162C130 192 126 226 130 256 132 274 136 288 138 300 148 302 156 300 158 294 150 272 144 248 146 224 148 200 154 180 160 164Z',
  torso: 'M132 155C126 185 128 215 136 245 140 265 144 287 148 307L172 307C176 285 182 257 186 229 190 197 188 171 182 155 172 147 142 147 132 155Z',
  sash: 'M170 150C182 154 190 164 192 176 186 170 179 166 171 163 164 166 156 168 149 166 154 156 162 149 170 150Z',
  sarong: 'M140 300C125 350 112 412 105 472 100 514 99 552 103 582 128 596 182 596 205 582 209 552 208 514 203 472 196 412 183 350 168 300Z',
  footFront: 'M154 582C170 590 190 602 202 614 210 621 208 631 199 630 183 629 166 618 156 606 149 598 150 588 154 582Z',
  footBack: 'M142 580C136 598 129 616 122 630 116 640 120 650 129 646 138 641 145 624 149 607 151 596 150 586 148 580Z',
  stick: 'M140 600C136 644 134 688 134 730 133 738 137 742 142 740 144 732 145 730 146 722 148 682 150 644 150 602Z',
};

const ARM = [
  'M186 151C200 153 210 163 217 178 224 176 233 173 241 174 245 179 246 187 244 193 232 195 222 198 212 200 204 191 194 176 186 166 183 162 183 155 186 151Z',
  'M240 172C252 170 262 174 262 182 262 190 252 196 242 194 236 190 235 178 240 172Z',
  'M256 172L276 165 278 171 258 178Z',
  'M258 182L280 181 280 187 258 188Z',
  'M258 190L277 198 274 204 255 195Z',
  'M253 196L266 210 261 215 248 201Z',
];

const SHARED_DETAILS = [
  'M144 162c8 9 22 9 30 0',
  'M152 169l6 9 6-9',
  'M178 164c9 3 15 8 19 15',
  'M226 176c6 2 11 4 16 7',
  'M180 152c-5 10-7 22-5 34',
  'M146 582c9 5 16 5 23 0',
  'M188 596c-6 9-15 15-24 17',
  'M142 298h42',
  'M158 292l6 13 6-13',
  'M106 494c-2 32-2 60 1 82',
  'M104 582c26 12 74 12 100 0',
];

const SARONG_PLEATS = [
  'M146 320c-12 58-20 124-23 190',
  'M160 316c-8 60-13 126-15 192',
  'M176 320c-2 58-2 124-1 188',
  'M130 354c-9 54-14 116-17 176',
  'M192 354c7 54 9 116 8 176',
];

const BATIK_LINES = [
  'M142 380c7-7 14-7 21 0M142 420c7-7 14-7 21 0M145 460c7-7 14-7 21 0M147 500c7-7 14-7 21 0M150 540c7-7 14-7 21 0',
  'M172 380c7-7 14-7 21 0M170 420c7-7 14-7 21 0M168 460c7-7 14-7 21 0M164 500c7-7 14-7 21 0M158 540c7-7 14-7 21 0',
  'M136 406c5 8 5 16 0 24M200 406c-5 8-5 16 0 24M138 466c5 8 5 16 0 24M198 466c-5 8-5 16 0 24',
];

const TONE_STOPS: Record<NonNullable<WayangFigureProps['tone']>, [string, string, string]> = {
  gold: ['#F6E3B6', '#C6A56B', '#7E5F2E'],
  maroon: ['#E8B98F', '#A8453F', '#5C1F1F'],
  ivory: ['#FFF9EC', '#E4D4B4', '#A08A5F'],
};

const BODY_STOPS: Record<NonNullable<WayangFigureProps['tone']>, [string, string, string]> = {
  gold: ['#6A4227', '#33200F', '#180D06'],
  maroon: ['#6E2A28', '#3A1615', '#190A09'],
  ivory: ['#8A6E45', '#4A3620', '#221708'],
};

/**
 * WAYANG KULIT — ilustrasi vektor orisinal.
 * Siluet tokoh gaya wayang Jawa: profil tajam, gelung/garuda mungkur,
 * kain berlipat dengan motif batik, lengan dapat dianimasikan.
 */
export function WayangFigure({
  variant = 'arjuna',
  mirror = false,
  animated = false,
  stick = true,
  tone = 'gold',
  className,
  opacity = 1,
  decorative = true,
}: WayangFigureProps) {
  const uid = useId().replace(/:/g, '');
  const bodyGrad = `wayang-body-${uid}`;
  const edgeGrad = `wayang-edge-${uid}`;
  const isFemale = variant === 'srikandi';
  const [b1, b2, b3] = BODY_STOPS[tone];
  const [e1, e2, e3] = TONE_STOPS[tone];

  return (
    <svg
      viewBox="0 0 320 780"
      className={cn('overflow-visible', className)}
      style={{ opacity }}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Ilustrasi wayang ${variant === 'arjuna' ? 'Arjuna' : 'Srikandi'}`}
    >
      <defs>
        <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={b1} />
          <stop offset="45%" stopColor={b2} />
          <stop offset="100%" stopColor={b3} />
        </linearGradient>
        <linearGradient id={edgeGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={e1} />
          <stop offset="50%" stopColor={e2} />
          <stop offset="100%" stopColor={e3} />
        </linearGradient>
      </defs>

      <g transform={mirror ? 'translate(320 0) scale(-1 1)' : undefined}>
        <g
          fill={`url(#${bodyGrad})`}
          stroke={`url(#${edgeGrad})`}
          strokeWidth="1.7"
          strokeLinejoin="round"
          style={{
            transformBox: 'view-box',
            transformOrigin: '142px 620px',
          }}
          className={animated ? 'wayang-sway' : undefined}
        >
          {/* Kipas bulu atau sanggul */}
          {isFemale ? (
            <>
              {SRIKANDI_BUN.map((d, i) => (
                <path key={`bun-${i}`} d={d} />
              ))}
            </>
          ) : (
            <g transform="translate(116 52)">
              {ARJUNA_FAN.map((f, i) => (
                <path key={`fan-${i}`} d={f.d} transform={`rotate(${f.rotate})`} />
              ))}
            </g>
          )}

          {/* Kepala */}
          <path d={isFemale ? SRIKANDI_HEAD : ARJUNA_HEAD} />

          {/* Leher, lengan belakang, badan, selendang, kain, kaki */}
          <path d={SHARED.neck} />
          <path d={SHARED.backArm} />
          <path d={SHARED.torso} />
          <path d={SHARED.sash} opacity="0.8" />
          <path d={SHARED.sarong} />
          <path d={SHARED.footFront} />
          <path d={SHARED.footBack} />

          {/* Lengan depan — titik putar di bahu */}
          <g
            style={{ transformBox: 'view-box', transformOrigin: '186px 158px' }}
            className={animated ? 'wayang-arm' : undefined}
          >
            {ARM.map((d, i) => (
              <path key={`arm-${i}`} d={d} />
            ))}
          </g>

          {stick && <path d={SHARED.stick} strokeWidth="1.2" />}
        </g>

        {/* Ukiran emas */}
        <g
          fill="none"
          stroke={`url(#${edgeGrad})`}
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.95"
          className={animated ? 'wayang-sway' : undefined}
          style={{ transformBox: 'view-box', transformOrigin: '142px 620px' }}
        >
          {(isFemale ? SRIKANDI_DETAILS : ARJUNA_DETAILS).map((d, i) => (
            <path key={`dt-${i}`} d={d} />
          ))}
          {SHARED_DETAILS.map((d, i) => (
            <path key={`sd-${i}`} d={d} strokeWidth={d === 'M142 298h42' ? 1.9 : undefined} />
          ))}
          {SARONG_PLEATS.map((d, i) => (
            <path key={`pl-${i}`} d={d} />
          ))}
          <g strokeWidth="0.85" opacity="0.7">
            {BATIK_LINES.map((d, i) => (
              <path key={`bt-${i}`} d={d} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}

/**
 * Bayangan wayang — siluet gelap tanpa ukiran, dipakai untuk efek
 * "wayang melintas" dan kedalaman latar.
 */
export function WayangShadow({
  variant = 'arjuna',
  mirror = false,
  className,
}: Pick<WayangFigureProps, 'variant' | 'mirror' | 'className'>) {
  return (
    <WayangFigure
      variant={variant}
      mirror={mirror}
      tone="gold"
      stick
      decorative
      className={cn('wayang-shadow', className)}
    />
  );
}
