import { cn } from '../../lib/utils';

type Pt = [number, number];

/* ---------------------------------------------------------------------------
 *  Path helpers
 * ------------------------------------------------------------------------- */

/** Konversi deretan titik menjadi path cubic-bezier yang halus (Catmull-Rom). */
function smoothPath(pts: Pt[], closed = false): string {
  if (pts.length < 2) return '';
  const n = pts.length;
  const at = (i: number): Pt => {
    if (closed) return pts[(i + n) % n];
    return pts[Math.min(n - 1, Math.max(0, i))];
  };
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  if (closed) d += ' Z';
  return d;
}

/** Setengah profil kanan gunungan (kayon), dari puncak ke dasar. */
const RIGHT_PROFILE: Pt[] = [
  [200, 6],
  [216, 30],
  [236, 62],
  [258, 104],
  [282, 152],
  [308, 208],
  [334, 270],
  [352, 330],
  [360, 380],
  [356, 424],
  [338, 464],
  [304, 502],
  [252, 534],
  [200, 552],
];

const FULL_PROFILE: Pt[] = [
  ...RIGHT_PROFILE,
  ...RIGHT_PROFILE.slice(1, -1).reverse().map(([x, y]): Pt => [400 - x, y]),
];

/** Titik pusat gunungan untuk perhitungan skala. */
const CX = 200;
const CY = 300;

function scalePt([x, y]: Pt, k: number, cx = CX, cy = CY): Pt {
  return [cx + (x - cx) * k, cy + (y - cy) * k];
}

/** Ukel / api (flame curl) — menggambar satu elemen dengan ujung menghadap -Y. */
const FLAME = 'M0 0C9 -3 17 -11 17 -23c0-9-8-15-14-10-5 4-2 11 4 11';

/** Ornamen sulur daun Jawa (leaf frond) dengan tangkai menghadap +Y. */
const FROND = 'M0 0c-4-8-4-18 0-26 4 8 4 18 0 26Zm0-24c3-6 8-9 13-9';

export interface GununganProps {
  className?: string;
  /** Tampilkan ornamen api di tepi (membutuhkan lebih banyak DOM) */
  flames?: boolean;
  /** Animasi denyut cahaya blencong di belakang gunungan */
  glow?: boolean;
}

/**
 * GUNUNGAN / KAYON
 * Simbol pembuka pertunjukan wayang — pohon kehidupan. Digambar sebagai
 * ilustrasi vektor orisinal: api (ukel) di tepi, gapura di dasar,
 * pohon hayat di tengah, dan penjaga raksasa.
 */
export function Gunungan({ className, flames = true, glow = true }: GununganProps) {
  const outer = smoothPath(FULL_PROFILE, true);
  const ring1 = smoothPath(FULL_PROFILE.map((p) => scalePt(p, 0.9)), true);
  const ring2 = smoothPath(FULL_PROFILE.map((p) => scalePt(p, 0.83)), true);
  const ring3 = smoothPath(FULL_PROFILE.map((p) => scalePt(p, 0.76)), true);

  // Posisi & rotasi setiap ukel di sepanjang tepi.
  const flameNodes = FULL_PROFILE.map((p, i) => {
    const prev = FULL_PROFILE[(i - 1 + FULL_PROFILE.length) % FULL_PROFILE.length];
    const next = FULL_PROFILE[(i + 1) % FULL_PROFILE.length];
    const angle = (Math.atan2(next[1] - prev[1], next[0] - prev[0]) * 180) / Math.PI - 90;
    return { p, angle, key: i };
  }).filter((_, i) => i % 1 === 0);

  return (
    <svg
      viewBox="0 0 400 570"
      className={cn('overflow-visible', className)}
      role="img"
      aria-label="Gunungan wayang, simbol pohon kehidupan dan pembuka pertunjukan"
    >
      <defs>
        <linearGradient id="gununganBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#432719" />
          <stop offset="45%" stopColor="#2C1710" />
          <stop offset="100%" stopColor="#1A0E08" />
        </linearGradient>
        <linearGradient id="gununganEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3DCA9" />
          <stop offset="50%" stopColor="#C6A56B" />
          <stop offset="100%" stopColor="#7E5F2E" />
        </linearGradient>
        <clipPath id="gununganClip">
          <path d={outer} />
        </clipPath>
      </defs>

      {/* Cahaya blencong di belakang kayon */}
      {glow && (
        <ellipse
          cx="200"
          cy="300"
          rx="230"
          ry="290"
          fill="url(#blencongGlow)"
          opacity="0.5"
          className="animate-pulse-subtle"
        />
      )}

      {/* Bayangan lembut */}
      <path d={outer} transform="translate(9 13)" fill="#0A0503" opacity="0.55" filter="url(#leatherShadow)" />

      {/* Badan gunungan */}
      <path d={outer} fill="url(#gununganBody)" stroke="url(#gununganEdge)" strokeWidth="2.4" />

      <g clipPath="url(#gununganClip)">
        {/* Tekstur kulit */}
        <rect x="0" y="0" width="400" height="570" fill="url(#batikCeplok)" color="#C6A56B" opacity="0.13" />

        {/* ---- Ornamen api (ukel) mengelilingi tepi ---- */}
        {flames && (
          <g fill="none" stroke="url(#gununganEdge)" strokeWidth="1.5" strokeLinecap="round" opacity="0.95">
            {flameNodes.map(({ p, angle, key }) => (
              <g key={key} transform={`translate(${p[0]} ${p[1]}) rotate(${angle + 180}) scale(1.15)`}>
                <path d={FLAME} />
              </g>
            ))}
          </g>
        )}

        {/* ---- Bingkai berlapis ---- */}
        <path d={ring1} fill="none" stroke="url(#gununganEdge)" strokeWidth="1.6" opacity="0.9" />
        <path d={ring2} fill="none" stroke="#8A6A34" strokeWidth="1" opacity="0.7" />
        <path d={ring3} fill="none" stroke="url(#gununganEdge)" strokeWidth="1.2" opacity="0.8" />

        {/* ---- Cincin ukiran di dalam tepi ---- */}
        <g fill="none" stroke="#C6A56B" strokeWidth="0.9" opacity="0.55">
          {FULL_PROFILE.filter((_, i) => i % 2 === 0).map((p, i) => {
            const s = scalePt(p, 0.935);
            const e = scalePt(p, 0.885);
            return <path key={`br-${i}`} d={`M${s[0]} ${s[1]}L${e[0]} ${e[1]}`} />;
          })}
        </g>

        {/* ================= ISI KAYON (simetris) ================= */}
        <g fill="none" stroke="url(#gununganEdge)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* --- Batang pohon hayat --- */}
          <path d="M200 132v300" strokeWidth="2.6" />
          <path d="M200 150c-14 4-24 14-28 28M200 150c14 4 24 14 28 28" />
          <path d="M200 196c-18 5-30 18-34 36M200 196c18 5 30 18 34 36" />
          <path d="M200 250c-20 6-32 20-36 40M200 250c20 6 32 20 36 40" />
          <path d="M200 306c-21 6-34 21-38 42M200 306c21 6 34 21 38 42" />

          {/* --- Daun frond bertingkat --- */}
          {[
            [200, 158, -1, 0.8],
            [200, 158, 1, 0.8],
            [200, 204, -1, 1],
            [200, 204, 1, 1],
            [200, 258, -1, 1.15],
            [200, 258, 1, 1.15],
            [200, 314, -1, 1.2],
            [200, 314, 1, 1.2],
          ].map(([x, y, dir, sc], i) => (
            <g key={`frond-${i}`} transform={`translate(${x} ${y}) scale(${dir} ${sc}) rotate(${dir < 0 ? 18 : -18})`}>
              <path d={FROND} />
            </g>
          ))}

          {/* --- Mahkota / lingga di puncak --- */}
          <path d="M200 132c-8-10-8-24 0-34 8 10 8 24 0 34Z" strokeWidth="1.8" />
          <circle cx="200" cy="92" r="4" strokeWidth="1.6" />
          <path d="M200 82v-10M186 96l-8-4M214 96l8-4" />

          {/* --- Burung / garuda di kedua sisi --- */}
          <g opacity="0.9">
            <path d="M164 176c-10-6-22-6-30 2 8 2 14 6 18 12M236 176c10-6 22-6 30 2-8 2-14 6-18 12" />
            <path d="M150 168c-4-6-12-8-18-4M250 168c4-6 12-8 18-4" />
          </g>
          <g opacity="0.75" transform="translate(0 60)">
            <path d="M164 176c-10-6-22-6-30 2 8 2 14 6 18 12M236 176c10-6 22-6 30 2-8 2-14 6-18 12" />
          </g>

          {/* --- Kera / satwa kecil di dahan --- */}
          <g opacity="0.85">
            <path d="M158 300c-6-8-6-18 0-24 6 6 6 16 0 24Z" />
            <path d="M242 300c6-8 6-18 0-24-6 6-6 16 0 24Z" />
            <circle cx="152" cy="288" r="2.4" />
            <circle cx="248" cy="288" r="2.4" />
          </g>

          {/* --- Gapura candi bentar di dasar --- */}
          <g strokeWidth="1.5">
            <path d="M200 520v-58" />
            <path d="M200 462l-30-26h60l-30 26Z" />
            <path d="M170 436v-22h60v22" />
            <path d="M164 414l6-16h60l6 16" />
            <path d="M170 436h60" />
            {/* undakan */}
            <path d="M158 520h84M150 528h100" />
          </g>

          {/* --- Penjaga raksasa (candika) di kedua dasar --- */}
          <g strokeWidth="1.4" opacity="0.95">
            {/* kiri */}
            <g>
              <path d="M148 500c-4-10-2-20 4-26 2 8 8 10 12 6" />
              <path d="M152 474c-2-8 2-14 8-16" />
              <path d="M160 458l10 4" />
              <circle cx="152" cy="452" r="2" />
            </g>
            {/* kanan */}
            <g transform="translate(400 0) scale(-1 1)">
              <path d="M148 500c-4-10-2-20 4-26 2 8 8 10 12 6" />
              <path d="M152 474c-2-8 2-14 8-16" />
              <path d="M160 458l10 4" />
              <circle cx="152" cy="452" r="2" />
            </g>
          </g>

          {/* --- Awan ukel di tengah --- */}
          <g opacity="0.6" strokeWidth="1.1">
            <path d="M200 380c-16 0-26-8-26-18 0-12 12-18 26-18s26 6 26 18c0 10-10 18-26 18Z" />
            <path d="M200 344v-14M188 380c-6 4-8 10-8 16M212 380c6 4 8 10 8 16" />
          </g>
        </g>
      </g>

      {/* Batas luar */}
      <path d={outer} fill="none" stroke="url(#gununganEdge)" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
