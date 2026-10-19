/**
 * ============================================================================
 *  ORNAMENT DEFS  ·  Gradients, Batik Patterns, Filters
 * ============================================================================
 *  Dirender SEKALI di root aplikasi. Semua ornamen lain merujuk ke sini
 *  melalui url(#id) sehingga DOM tetap ringan walaupun pola batik dipakai
 *  di banyak tempat.
 * ============================================================================
 */

export function OrnamentDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* ---------------- Gradients ---------------- */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8E7BE" />
          <stop offset="35%" stopColor="#DFB76C" />
          <stop offset="65%" stopColor="#C6A56B" />
          <stop offset="100%" stopColor="#8A6A34" />
        </linearGradient>
        <linearGradient id="goldGradV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4E0B9" />
          <stop offset="55%" stopColor="#C6A56B" />
          <stop offset="100%" stopColor="#7A5C2C" />
        </linearGradient>
        <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A3622" />
          <stop offset="100%" stopColor="#2A1409" />
        </linearGradient>
        <radialGradient id="blencongGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#E8B95F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C6A56B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="warmLamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD98A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFB84D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="verdigris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C6A56B" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#C6A56B" stopOpacity="0" />
        </radialGradient>

        {/* ---------------- Filters ---------------- */}
        <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="leatherShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="6" dy="10" stdDeviation="9" floodColor="#100804" floodOpacity="0.75" />
        </filter>
        <filter id="engrave" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>

        {/* ---------------- Batik: Parang Rusak ---------------- */}
        <pattern
          id="batikParang"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="72" height="72" fill="none" />
          {/* Deret bilah parang */}
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M8 64C8 46 24 46 24 30 24 14 40 14 40 -2" />
            <path d="M20 68C20 52 36 52 36 36 36 20 52 20 52 4" />
            <path d="M32 72C32 56 48 56 48 40 48 24 64 24 64 8" />
            <path d="M44 72C44 58 60 58 60 44" />
          </g>
          <g fill="currentColor">
            <circle cx="14" cy="40" r="1.6" />
            <circle cx="26" cy="44" r="1.6" />
            <circle cx="38" cy="48" r="1.6" />
            <circle cx="50" cy="52" r="1.6" />
            <circle cx="8" cy="30" r="1.2" />
            <circle cx="44" cy="30" r="1.2" />
            <circle cx="56" cy="36" r="1.2" />
          </g>
        </pattern>

        {/* ---------------- Batik: Kawung ---------------- */}
        <pattern id="batikKawung" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <ellipse cx="28" cy="14" rx="8" ry="13" />
            <ellipse cx="28" cy="42" rx="8" ry="13" />
            <ellipse cx="14" cy="28" rx="13" ry="8" />
            <ellipse cx="42" cy="28" rx="13" ry="8" />
          </g>
          <g fill="currentColor">
            <circle cx="28" cy="28" r="2.2" />
            <circle cx="0" cy="0" r="1.4" />
            <circle cx="56" cy="0" r="1.4" />
            <circle cx="0" cy="56" r="1.4" />
            <circle cx="56" cy="56" r="1.4" />
          </g>
        </pattern>

        {/* ---------------- Batik: Truntum (bunga melati) ---------------- */}
        <pattern id="batikTruntum" width="48" height="48" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            {/* bintang melati 8 kelopak */}
            <g>
              <rect x="23" y="3" width="2" height="14" rx="1" />
              <rect x="23" y="31" width="2" height="14" rx="1" />
              <rect x="3" y="23" width="14" height="2" rx="1" />
              <rect x="31" y="23" width="14" height="2" rx="1" />
              <rect x="23" y="3" width="2" height="14" rx="1" transform="rotate(45 24 24)" />
              <rect x="23" y="31" width="2" height="14" rx="1" transform="rotate(45 24 24)" />
              <rect x="3" y="23" width="14" height="2" rx="1" transform="rotate(45 24 24)" />
              <rect x="31" y="23" width="14" height="2" rx="1" transform="rotate(45 24 24)" />
              <circle cx="24" cy="24" r="3.2" />
            </g>
          </g>
          <g fill="currentColor" opacity="0.75">
            <circle cx="6" cy="6" r="1.3" />
            <circle cx="42" cy="6" r="1.3" />
            <circle cx="6" cy="42" r="1.3" />
            <circle cx="42" cy="42" r="1.3" />
            <circle cx="24" cy="46" r="1" />
            <circle cx="24" cy="2" r="1" />
          </g>
        </pattern>

        {/* ---------------- Batik: Ceplok ---------------- */}
        <pattern id="batikCeplok" width="44" height="44" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <rect x="12" y="12" width="20" height="20" transform="rotate(45 22 22)" />
            <circle cx="22" cy="22" r="5" />
          </g>
          <g fill="currentColor" opacity="0.85">
            <circle cx="22" cy="22" r="1.7" />
            <circle cx="0" cy="0" r="1.3" />
            <circle cx="44" cy="0" r="1.3" />
            <circle cx="0" cy="44" r="1.3" />
            <circle cx="44" cy="44" r="1.3" />
          </g>
        </pattern>

        {/* ---------------- Ukiran kayu (ukiran Jepara/Kudus) ---------------- */}
        <pattern id="ukiranWood" width="60" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M6 30c0-9 8-9 8-18 0-6 6-8 10-4" />
            <path d="M18 54c0-9 8-9 8-18" />
            <path d="M40 30c0-9-8-9-8-18 0-6-6-8-10-4" />
            <path d="M52 54c0-9-8-9-8-18" />
            <path d="M0 42c4 0 6-3 6-6" />
            <path d="M60 42c-4 0-6-3-6-6" />
          </g>
          <g fill="currentColor">
            <circle cx="30" cy="22" r="1.6" />
            <circle cx="30" cy="46" r="1.4" />
          </g>
        </pattern>

        {/* ---------------- Gulungan awan/ukel (wayang) ---------------- */}
        <pattern id="ukelCloud" width="90" height="90" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
            <path d="M4 46c0-10 8-14 16-11 2-8 12-11 18-6 5-7 16-6 19 2" />
            <path d="M12 58c3 6 12 8 18 3" />
            <circle cx="66" cy="24" r="7" />
            <circle cx="66" cy="24" r="3" />
            <path d="M50 62c6 0 10-4 10-9" />
          </g>
        </pattern>

        {/* ---------------- Gradient untuk foto duotone ---------------- */}
        <linearGradient id="photoWash" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29170F" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#29170F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1A0E08" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
