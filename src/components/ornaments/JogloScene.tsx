import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

/* ==========================================================================
 *  JOGLO SCENE  ·  latar arsitektur Jawa sinematik, berlapis & berparalaks
 * ==========================================================================
 *  Enam lapis SVG terpisah yang bergerak dengan kecepatan berbeda sehingga
 *  terasa seperti ilustrasi editorial tiga dimensi, bukan gambar datar.
 *  Semua lapis berbagi viewBox 0 0 1200 620 agar sejajar sempurna.
 * ======================================================================== */

const VIEW_BOX = '0 0 1200 620';

function Layer({
  className,
  children,
  preserveAspectRatio = 'xMidYMid slice',
}: {
  className?: string;
  children: React.ReactNode;
  preserveAspectRatio?: string;
}) {
  return (
    <svg
      viewBox={VIEW_BOX}
      preserveAspectRatio={preserveAspectRatio}
      className={cn('absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export interface JogloSceneProps {
  className?: string;
  /** Tingkatkan intensitas cahaya senja */
  evening?: boolean;
}

export function JogloScene({ className, evening = true }: JogloSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const mk = (from: number, to: number) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [from, to]);

  const skyY = mk(-14, 14);
  const farY = mk(-30, 30);
  const nearY = mk(-52, 52);
  const mistY = mk(-20, 20);
  const buildY = mk(-78, 78);
  const frontY = mk(-110, 110);

  return (
    <div ref={ref} className={cn('relative isolate overflow-hidden', className)}>
      {/* ---------- LANGIT & CAHAYA SENJA ---------- */}
      <motion.div style={{ y: skyY }} className="absolute -inset-y-[6%] inset-x-0">
        <Layer>
          <defs>
            <linearGradient id="js-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#180C06" />
              <stop offset="36%" stopColor="#33190D" />
              <stop offset="64%" stopColor="#5E3116" />
              <stop offset="86%" stopColor="#8A4E22" />
              <stop offset="100%" stopColor="#AE6A2E" />
            </linearGradient>
            <radialGradient id="js-sun" cx="50%" cy="72%" r="46%">
              <stop offset="0%" stopColor="#FFDE9A" stopOpacity={evening ? 0.85 : 0.5} />
              <stop offset="42%" stopColor="#E8A94E" stopOpacity={evening ? 0.34 : 0.2} />
              <stop offset="100%" stopColor="#C6A56B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="620" fill="url(#js-sky)" />
          <ellipse cx="600" cy="440" rx="580" ry="300" fill="url(#js-sun)" className="blencong" />
        </Layer>
        {/* Burung di kejauhan */}
        <Layer>
          <g stroke="#2A1509" strokeWidth="2.6" fill="none" strokeLinecap="round" className="garuda-float">
            <path d="M420 152c8-8 16-8 22 0 6-8 14-8 22 0" />
            <path d="M470 184c6-6 12-6 17 0 5-6 11-6 17 0" />
            <path d="M790 132c8-8 16-8 22 0 6-8 14-8 22 0" />
            <path d="M742 174c5-5 10-5 14 0 4-5 9-5 14 0" />
            <path d="M640 106c4-4 8-4 11 0 3-4 7-4 11 0" />
          </g>
        </Layer>
      </motion.div>

      {/* ---------- GUNUNG JAUH ---------- */}
      <motion.div style={{ y: farY }} className="absolute -inset-y-[8%] inset-x-0">
        <Layer>
          <defs>
            <linearGradient id="js-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A2714" />
              <stop offset="100%" stopColor="#331A0D" />
            </linearGradient>
            <linearGradient id="js-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A150C" />
              <stop offset="100%" stopColor="#180B05" />
            </linearGradient>
          </defs>
          <path
            d="M0 402L120 316 220 372 330 262 430 356 540 296 660 372 780 288 900 366 1020 306 1120 372 1200 336V450H0Z"
            fill="url(#js-far)"
            opacity="0.7"
          />
          <path
            d="M0 428L140 366 260 420 400 342 520 412 660 356 800 420 940 358 1080 420 1200 380V458H0Z"
            fill="url(#js-near)"
            opacity="0.9"
          />
        </Layer>
      </motion.div>

      {/* ---------- PEPOHONAN JAUH ---------- */}
      <motion.div style={{ y: nearY }} className="absolute -inset-y-[10%] inset-x-0">
        <Layer>
          <g fill="#1C0E07" opacity="0.92">
            <path d="M96 446c-14-4-22-14-20-24 2-12 14-18 26-14 4-12 18-18 30-12 12 6 14 20 6 30 8 6 6 16-4 20-12 5-28 5-38 0Z" />
            <path d="M120 446v30" />
            <path d="M1120 442c-12-4-20-13-18-22 2-11 13-16 24-13 4-11 16-16 27-11 11 6 13 18 5 27 7 6 5 15-4 18-11 5-25 4-34 1Z" />
            <path d="M1142 442v34" />
            <path d="M212 452c-11-3-17-11-15-19 2-9 11-14 20-11 3-9 14-14 23-9 9 5 11 15 4 23 6 5 4 12-3 15-9 4-21 3-29 1Z" />
            <path d="M1012 450c-11-3-17-11-15-19 2-9 11-14 20-11 3-9 14-14 23-9 9 5 11 15 4 23 6 5 4 12-3 15-9 4-21 3-29 1Z" />
          </g>
        </Layer>
      </motion.div>

      {/* ---------- KABUT SENJA ---------- */}
      <motion.div style={{ y: mistY }} className="absolute inset-x-0 bottom-[16%] h-[18%]">
        <Layer preserveAspectRatio="none">
          <defs>
            <linearGradient id="js-mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6A56B" stopOpacity="0" />
              <stop offset="100%" stopColor="#DDBE85" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="1200" height="620" fill="url(#js-mist)" />
        </Layer>
      </motion.div>

      {/* ---------- BANGUNAN ADAT ---------- */}
      <motion.div style={{ y: buildY }} className="absolute -inset-y-[12%] inset-x-0">
        <Layer>
          <defs>
            <linearGradient id="js-roof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#52301A" />
              <stop offset="100%" stopColor="#1E1007" />
            </linearGradient>
            <radialGradient id="js-lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE1A0" stopOpacity="0.95" />
              <stop offset="42%" stopColor="#F0B95E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E8A94E" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="js-floorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8A94E" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#E8A94E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ---- CANDI BENTAR (kanan) ---- */}
          <g transform="translate(944 300) scale(0.72)" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.6">
            <path d="M14 210V54l14-46 14 46v156Z" />
            <path d="M104 210V54l14-46 14 46v156Z" />
            <path d="M6 76h120l10 20H-4Z" />
            <path d="M0 110h132l8 16H-8Z" />
            <path d="M-10 148h152l10 22H-20Z" />
            <path d="M-22 200h176l12 26H-34Z" />
            <g stroke="url(#goldGrad)" strokeWidth="1" fill="none" opacity="0.7">
              <path d="M6 86c6 5 12 5 18 0M112 86c6 5 12 5 18 0" />
            </g>
          </g>

          {/* ---- PENDOPO KECIL (kiri) ---- */}
          <g transform="translate(70 306) scale(0.62)">
            <rect x="150" y="8" width="20" height="12" rx="2" fill="url(#goldGrad)" />
            <path d="M160 20C144 44 118 80 88 110H232C202 80 176 44 160 20Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="2" />
            <g stroke="url(#goldGrad)" strokeWidth="1.3" fill="none" opacity="0.9">
              <path d="M88 110H232" />
              <path d="M78 122H242" />
              <path d="M84 116c8 7 16 7 24 0M124 116c8 7 16 7 24 0M164 116c8 7 16 7 24 0M204 116c8 7 16 7 24 0" />
            </g>
            <path d="M78 128H242L326 224H-6Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="2" />
            <path d="M-6 224C-26 221-44 212-52 200c14 5 30 8 46 10Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.4" />
            <path d="M326 224C346 221 364 212 372 200c-14 5-30 8-46 10Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.4" />
            <g stroke="url(#goldGrad)" strokeWidth="1.3" fill="none" opacity="0.9">
              <path d="M-6 224H326" />
              <path d="M-14 236H334" />
              <path d="M-8 230c10 8 20 8 30 0M42 230c10 8 20 8 30 0M92 230c10 8 20 8 30 0M142 230c10 8 20 8 30 0M192 230c10 8 20 8 30 0M242 230c10 8 20 8 30 0M292 230c10 8 20 8 30 0" />
            </g>
            <path d="M0 244H320V362H0Z" fill="#120803" />
            <g fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.6">
              <rect x="10" y="244" width="20" height="118" />
              <rect x="290" y="244" width="20" height="118" />
              <rect x="150" y="244" width="20" height="118" />
            </g>
            <ellipse cx="160" cy="300" rx="130" ry="90" fill="url(#js-lamp)" opacity="0.42" className="blencong" />
            <path d="M160 244v22" stroke="url(#goldGrad)" strokeWidth="1.2" />
            <path d="M144 266h32l-6 20h-20Z" fill="url(#goldGrad)" />
            <path d="M-14 362H334V384H-14Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.4" />
            <path d="M14 384H306V404H14Z" fill="#190D06" stroke="url(#goldGrad)" strokeWidth="1" />
            <ellipse cx="160" cy="378" rx="150" ry="34" fill="url(#js-floorGlow)" />
          </g>

          {/* ---- JOGLO UTAMA (tengah) ---- */}
          <g transform="translate(364 190) scale(0.62)">
            <path d="M380 20c-8-6-8-16 0-22 8 6 8 16 0 22Z" fill="url(#goldGrad)" />
            <rect x="368" y="18" width="24" height="14" rx="2" fill="url(#goldGrad)" stroke="#7E5F2E" strokeWidth="1" />
            <path d="M380 32C360 62 330 104 292 140H468C430 104 400 62 380 32Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="2" />
            <g stroke="url(#goldGrad)" strokeWidth="1.4" fill="none" opacity="0.9">
              <path d="M292 140H468" />
              <path d="M280 150H480" />
              <path d="M288 146c10 8 20 8 30 0M326 146c10 8 20 8 30 0M364 146c10 8 20 8 30 0M402 146c10 8 20 8 30 0M440 146c10 8 20 8 30 0" />
            </g>
            <path d="M280 158H480L606 258H154Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="2" />
            <path d="M154 258C132 254 112 244 102 230c16 6 34 10 52 12Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <path d="M606 258C628 254 648 244 658 230c-16 6-34 10-52 12Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <g stroke="url(#goldGrad)" strokeWidth="1.4" fill="none" opacity="0.9">
              <path d="M154 258H606" />
              <path d="M142 270H618" />
              <path d="M148 264c12 9 24 9 36 0M196 264c12 9 24 9 36 0M244 264c12 9 24 9 36 0M292 264c12 9 24 9 36 0M340 264c12 9 24 9 36 0M388 264c12 9 24 9 36 0M436 264c12 9 24 9 36 0M484 264c12 9 24 9 36 0M532 264c12 9 24 9 36 0" />
            </g>
            <path d="M158 278H602V430H158Z" fill="#120803" />
            <g stroke="url(#goldGrad)" strokeWidth="1.1" fill="none" opacity="0.4">
              <path d="M196 300h108v130H196Z" />
              <path d="M456 300h108v130H456Z" />
              <path d="M214 322c14-10 32-10 46 0M214 356c14-10 32-10 46 0M214 390c14-10 32-10 46 0" />
              <path d="M474 322c14-10 32-10 46 0M474 356c14-10 32-10 46 0M474 390c14-10 32-10 46 0" />
            </g>
            <g fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.8">
              <rect x="170" y="278" width="26" height="152" />
              <rect x="322" y="278" width="26" height="152" />
              <rect x="412" y="278" width="26" height="152" />
              <rect x="564" y="278" width="26" height="152" />
            </g>
            <g stroke="url(#goldGrad)" strokeWidth="1" fill="none" opacity="0.65">
              <path d="M175 306c6 4 11 4 16 0M175 340c6 4 11 4 16 0M175 374c6 4 11 4 16 0M175 408c6 4 11 4 16 0" />
              <path d="M327 306c6 4 11 4 16 0M327 340c6 4 11 4 16 0M327 374c6 4 11 4 16 0M327 408c6 4 11 4 16 0" />
              <path d="M417 306c6 4 11 4 16 0M417 340c6 4 11 4 16 0M417 374c6 4 11 4 16 0M417 408c6 4 11 4 16 0" />
              <path d="M569 306c6 4 11 4 16 0M569 340c6 4 11 4 16 0M569 374c6 4 11 4 16 0M569 408c6 4 11 4 16 0" />
            </g>
            <g fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.4" opacity="0.95">
              <rect x="112" y="288" width="18" height="142" />
              <rect x="630" y="288" width="18" height="142" />
            </g>
            <ellipse cx="380" cy="330" rx="190" ry="150" fill="url(#js-lamp)" opacity="0.5" className="blencong" />
            <path d="M380 278v30" stroke="url(#goldGrad)" strokeWidth="1.4" />
            <path d="M358 308h44l-8 26h-28Z" fill="url(#goldGrad)" opacity="0.95" />
            <circle cx="380" cy="298" r="5" fill="#FFF0C4" />
            <path d="M142 430H618V456H142Z" fill="url(#js-roof)" stroke="url(#goldGrad)" strokeWidth="1.6" />
            <path d="M180 456H580V478H180Z" fill="#1C0E07" stroke="url(#goldGrad)" strokeWidth="1.2" />
            <path d="M212 478H548V500H212Z" fill="#150A05" stroke="url(#goldGrad)" strokeWidth="1.2" />
            <path d="M244 500H516V522H244Z" fill="#100703" stroke="url(#goldGrad)" strokeWidth="1.2" />
            <ellipse cx="380" cy="470" rx="240" ry="56" fill="url(#js-floorGlow)" />
          </g>
        </Layer>
      </motion.div>

      {/* ---------- TANAH & TAMAN DEPAN ---------- */}
      <motion.div style={{ y: frontY }} className="absolute -inset-y-[14%] inset-x-0">
        <Layer>
          <defs>
            <linearGradient id="js-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A170C" />
              <stop offset="100%" stopColor="#0E0702" />
            </linearGradient>
            <radialGradient id="js-spill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8A94E" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#E8A94E" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M0 500C160 486 320 496 480 504 660 513 860 496 1040 502 1110 504 1160 508 1200 512V620H0Z"
            fill="url(#js-ground)"
          />
          <ellipse cx="600" cy="520" rx="420" ry="70" fill="url(#js-spill)" />
          <g fill="#0E0702">
            <path d="M74 620V470c0-10-6-18-14-22 12 2 22 10 26 22 4-14 16-24 30-26-10 6-16 16-16 26v150Z" />
            <path d="M46 452c-14-6-20-20-14-32 6-12 22-16 34-8 8-12 26-14 36-4 10 10 8 26-4 34-8 6-18 8-28 6-6 2-16 5-24 4Z" />
            <path d="M104 434c-10-4-14-14-10-22 4-8 16-11 24-6 6-8 18-10 25-3 7 7 6 18-3 24-6 4-12 5-20 4-4 1-11 3-16 3Z" />
            <path d="M1150 620V452c0-6-4-10-10-12 10 0 18 6 22 14 4-10 14-16 24-16-8 4-12 12-12 20v162Z" />
          </g>
          <g stroke="#0E0702" strokeWidth="9" fill="none" strokeLinecap="round">
            <path d="M1162 448c-26-16-52-16-70-2M1162 448c-24 14-44 34-50 54M1162 448c4-22 20-36 40-40M1162 448c26-4 48 8 60 28" />
          </g>
          <g fill="#0E0702">
            <path d="M180 620c-8-30 4-56 28-70-10 26-6 50 8 70Z" />
            <path d="M216 620c-4-24 6-44 24-54-8 20-6 38 4 54Z" />
            <path d="M880 620c8-34-4-62-30-78 12 30 6 56-10 78Z" />
            <path d="M920 620c4-26-6-46-24-56 8 20 6 40-4 56Z" />
            <path d="M0 604c60-10 120-14 180-12v28H0Z" />
            <path d="M1020 610c60-6 120-6 180 4v6h-180Z" />
          </g>
          <g stroke="url(#goldGrad)" strokeWidth="1.1" fill="none" opacity="0.55">
            <path d="M300 620c0-20 2-36 6-48M306 596c-6-8-14-12-22-12M306 592c8-8 18-10 26-6" />
            <path d="M760 620c0-22-2-38-6-50M754 592c-8-8-18-10-28-8M754 588c8-10 20-12 30-8" />
          </g>
        </Layer>
      </motion.div>
    </div>
  );
}
