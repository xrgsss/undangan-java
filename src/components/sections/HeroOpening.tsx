import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { InvitationConfig } from '../../types/invitation';
import { Gunungan } from '../ornaments/Gunungan';
import { OrnateDivider, UkelFlourish, BatikPanel } from '../ornaments/Ornaments';
import { WayangFigure, WayangShadow } from '../ornaments/WayangFigure';
import { EmberField } from '../effects/Particles';
import { GoldPill, Reveal, StaggerText } from '../ui/primitives';
import { initialsOf } from '../../lib/utils';

/* ==========================================================================
 *  SECTION 1 — HERO
 * ======================================================================== */

export function HeroSection({ config }: { config: InvitationConfig }) {
  const reduce = useReducedMotion();
  const monogram = initialsOf(config.groom.nickname, config.bride.nickname);

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-24">
      <BatikPanel motif="kawung" opacity={0.09} />
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette" aria-hidden="true" />
      <EmberField count={14} />

      {/* Gunungan latar */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[48%] w-[112vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:w-[58vw]"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Gunungan flames={false} className="h-auto w-full" />
      </motion.div>

      {/* Wayang kiri & kanan */}
      <div className="pointer-events-none absolute -bottom-4 left-[-14%] w-[42vw] max-w-[220px] opacity-70 sm:left-[-2%] sm:w-[22vw]">
        <WayangFigure variant="arjuna" animated tone="gold" className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute -bottom-4 right-[-14%] w-[42vw] max-w-[220px] opacity-70 sm:right-[-2%] sm:w-[22vw]">
        <WayangFigure variant="srikandi" mirror animated tone="gold" className="h-auto w-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <Reveal y={-14}>
          <GoldPill>{config.heroTitle}</GoldPill>
        </Reveal>

        <Reveal delay={0.12} className="mt-6">
          <UkelFlourish className="h-9 w-44 opacity-85 sm:h-11 sm:w-56" />
        </Reveal>

        {/* Monogram */}
        <Reveal delay={0.2} y={18} className="mt-4">
          <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path
                d="M60 4C74 18 90 32 100 56 108 76 106 96 90 108 76 118 44 118 30 108 14 96 12 76 20 56 30 32 46 18 60 4Z"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="1.3"
                opacity="0.85"
              />
              <path
                d="M60 14C71 25 84 36 92 56 98 71 96 87 84 96 73 103 47 103 36 96 24 87 22 71 28 56 36 36 49 25 60 14Z"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="0.8"
                opacity="0.55"
              />
            </svg>
            <span className="font-script text-3xl text-shimmer sm:text-4xl">{monogram}</span>
          </div>
        </Reveal>

        {/* Nama pengantin */}
        <StaggerText
          as="h1"
          text={`${config.groom.nickname} & ${config.bride.nickname}`}
          className="mt-6 font-cinzeldec text-[2.15rem] leading-[1.12] text-gold-gradient text-gold-glow sm:text-5xl md:text-6xl"
        />

        <Reveal delay={0.55} className="mt-5 w-full max-w-md">
          <OrnateDivider />
        </Reveal>

        <Reveal delay={0.7}>
          <p className="mt-4 font-serif text-base tracking-[0.16em] text-jawa-beige sm:text-lg">
            {config.weddingDayLabel}, {config.weddingDateLabel}
          </p>
          <p className="mt-2 font-cinzel text-[10px] uppercase tracking-[0.4em] text-jawa-gold/80 sm:text-xs">
            {config.events[0]?.venueName ?? ''}
          </p>
        </Reveal>

        {!reduce && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-1 text-jawa-gold/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <span className="font-cinzel text-[9px] uppercase tracking-[0.4em]">Gulir</span>
            <ChevronDown size={16} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
 *  TRANSISI WAYANG  ·  bayangan wayang melintas dengan cahaya blencong
 * ======================================================================== */

export function WayangTransition({
  variant = 'arjuna',
  label,
}: {
  variant?: 'arjuna' | 'srikandi';
  label?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative isolate h-40 overflow-hidden sm:h-52" aria-hidden={!label}>
      {/* Panggung gelap */}
      <div className="absolute inset-0 bg-gradient-to-b from-jawa-espresso via-jawa-chocolate to-jawa-espresso" />
      {/* Cahaya blencong */}
      <div
        className="blencong absolute left-1/2 top-1/2 h-[140%] w-[70%] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,217,138,0.22) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-jawa-espresso to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-batik-ceplok opacity-[0.06]" />

      {/* Bayangan wayang melintas */}
      {!reduce && (
        <>
          <div className="wayang-cross-lane absolute bottom-[-18%] left-0 w-[16%] min-w-[70px] max-w-[130px]" style={{ animationDuration: '38s' }}>
            <WayangShadow variant={variant} className="h-auto w-full rotate-[4deg]" />
          </div>
          <div
            className="wayang-cross-lane absolute bottom-[-26%] left-0 w-[13%] min-w-[56px] max-w-[104px]"
            style={{ animationDuration: '52s', animationDelay: '6s' }}
          >
            <WayangShadow variant={variant === 'arjuna' ? 'srikandi' : 'arjuna'} mirror className="h-auto w-full -rotate-[3deg] opacity-70" />
          </div>
        </>
      )}

      {label && (
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <p className="text-center font-cinzel text-[10px] uppercase tracking-[0.5em] text-jawa-gold/85 sm:text-xs">
            {label}
          </p>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
 *  SECTION 2 — SALAM PEMBUKA
 * ======================================================================== */

export function OpeningSection({ config }: { config: InvitationConfig }) {
  return (
    <section id="salam" className="relative scroll-mt-20 overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <BatikPanel motif="truntum" opacity={0.08} />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="font-arabic text-2xl leading-loose text-jawa-goldlight sm:text-3xl">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <OrnateDivider />
        </Reveal>

        <Reveal delay={0.25}>
          <h2 className="mt-8 font-cinzeldec text-2xl leading-snug text-gold-gradient sm:text-3xl md:text-4xl">
            Sugeng Rawuh
          </h2>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-6 font-serif text-[1.05rem] leading-[1.95] text-jawa-beige sm:text-lg sm:leading-[2.05]">
            {config.openingText}
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <p className="mt-8 font-cinzel text-[10px] uppercase tracking-[0.38em] text-jawa-gold/75 sm:text-xs">
            {config.hostLine}
          </p>
        </Reveal>
      </div>

      {/* Ornamen bunga kecil di sudut */}
      <div className="pointer-events-none absolute -bottom-6 -left-8 w-56 opacity-40 sm:w-72" aria-hidden="true">
        <UkelFlourish className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-8 w-56 -scale-x-100 opacity-40 sm:w-72" aria-hidden="true">
        <UkelFlourish className="h-auto w-full" />
      </div>
    </section>
  );
}

/* ==========================================================================
 *  SECTION 3 — AYAT / KUTIPAN
 * ======================================================================== */

export function QuoteSection({ config }: { config: InvitationConfig }) {
  const { quote } = config;
  if (!quote.enabled) return null;

  return (
    <section id="kutipan" className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <BatikPanel motif="ceplok" opacity={0.07} />

      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <div className="gold-frame-double relative rounded-3xl bg-jawa-espresso/55 px-5 py-10 backdrop-blur-sm sm:px-12 sm:py-14">
            {/* hiasan sudut */}
            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2">
              <Gunungan flames={false} glow={false} className="h-14 w-auto opacity-90" />
            </div>

            {quote.arabic && (
              <p className="font-arabic mt-4 text-center text-[1.35rem] leading-[2.4] text-jawa-goldlight sm:text-[1.75rem]">
                {quote.arabic}
              </p>
            )}

            <div className="my-7 flex justify-center">
              <span className="h-px w-24 bg-gradient-to-r from-transparent via-jawa-gold to-transparent" />
            </div>

            <blockquote className="text-center font-serif text-[1.02rem] leading-[2] text-jawa-ivory/95 sm:text-[1.15rem] sm:leading-[2.05]">
              “{quote.text}”
            </blockquote>

            {quote.translation && (
              <p className="mt-6 text-center font-serif text-sm italic leading-relaxed text-jawa-beige/75 sm:text-base">
                {quote.translation}
              </p>
            )}

            <p className="mt-7 text-center font-cinzel text-[10px] uppercase tracking-[0.42em] text-jawa-gold sm:text-xs">
              {quote.source}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
