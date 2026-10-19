import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, MailOpen, Volume2, VolumeX } from 'lucide-react';
import type { GuestContext, InvitationConfig } from '../../types/invitation';
import { Gunungan } from '../ornaments/Gunungan';
import { FloralCorner, OrnateDivider, UkelFlourish } from '../ornaments/Ornaments';
import { WayangFigure } from '../ornaments/WayangFigure';
import { PetalField } from '../effects/Particles';
import { initialsOf } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface CoverScreenProps {
  config: InvitationConfig;
  guest: GuestContext;
  onOpen: (options: { startMusic: boolean }) => void;
  musicEnabled: boolean;
}

const OPEN_DURATION = 1500;

export function CoverScreen({ config, guest, onOpen, musicEnabled }: CoverScreenProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'opening'>('idle');
  const [wantsMusic, setWantsMusic] = useState(musicEnabled);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  // Parallax halus mengikuti gerakan kursor (desktop saja).
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduce]);

  const handleOpen = () => {
    if (phase === 'opening') return;
    setPhase('opening');
    onOpen({ startMusic: wantsMusic });
    timer.current = window.setTimeout(() => {
      document.dispatchEvent(new CustomEvent('cover:closed'));
    }, OPEN_DURATION);
  };

  const monogram = initialsOf(config.groom.nickname, config.bride.nickname);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Halaman pembuka undangan">
      {/* ============ PANEL TIRAI (membuka saat tombol ditekan) ============ */}
      <AnimatePresence>
        {phase === 'opening' && (
          <>
            <motion.div
              className="absolute inset-y-0 left-0 z-40 w-1/2 origin-left bg-jawa-espresso"
              initial={{ x: '0%' }}
              animate={{ x: '-101%' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute inset-0 bg-batik-parang opacity-30" />
              <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-transparent via-jawa-gold to-transparent" />
            </motion.div>
            <motion.div
              className="absolute inset-y-0 right-0 z-40 w-1/2 origin-right bg-jawa-espresso"
              initial={{ x: '0%' }}
              animate={{ x: '101%' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute inset-0 bg-batik-parang opacity-30" />
              <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-jawa-gold to-transparent" />
            </motion.div>
            {/* Kilau emas di tengah tirai */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-50 w-[46vw] -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.5, times: [0, 0.45, 1] }}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,233,176,0.85) 0%, rgba(232,169,78,0.25) 45%, transparent 75%)',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ============ ISI COVER ============ */}
      <motion.div
        className="absolute inset-0 z-30 overflow-hidden bg-parchment-texture"
        animate={phase === 'opening' ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: phase === 'opening' ? 0.35 : 0, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Tekstur batik berlapis */}
        <div className="pointer-events-none absolute inset-0 bg-batik-parang opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-25" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-radial-vignette" aria-hidden="true" />

        {/* Cahaya blencong di belakang gunungan */}
        <div
          className="blencong pointer-events-none absolute left-1/2 top-[46%] h-[62vh] w-[62vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,217,138,0.30) 0%, rgba(232,169,78,0.10) 40%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* ===== GUNUNGAN (parallax) ===== */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 w-[74vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 sm:w-[52vw]"
          style={{ x: mouse.x * -14, y: mouse.y * -10 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.92, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Gunungan className="h-auto w-full drop-shadow-[0_18px_45px_rgba(0,0,0,0.75)]" />
        </motion.div>

        {/* ===== WAYANG KIRI (Arjuna) ===== */}
        <motion.div
          className="pointer-events-none absolute -bottom-[2%] left-[-10%] w-[46vw] max-w-[260px] sm:left-[-4%] sm:w-[26vw]"
          style={{ x: mouse.x * 18 }}
          initial={{ opacity: 0, x: -70, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <WayangFigure variant="arjuna" animated tone="gold" className="h-auto w-full opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* ===== WAYANG KANAN (Srikandi) ===== */}
        <motion.div
          className="pointer-events-none absolute -bottom-[2%] right-[-10%] w-[46vw] max-w-[260px] sm:right-[-4%] sm:w-[26vw]"
          style={{ x: mouse.x * -18 }}
          initial={{ opacity: 0, x: 70, rotate: 6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <WayangFigure variant="srikandi" mirror animated tone="gold" className="h-auto w-full opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* ===== KONTEN UTAMA ===== */}
        <div className="relative z-20 flex h-full flex-col items-center justify-between px-6 py-8 sm:py-12">
          {/* --- atas --- */}
          <motion.div
            className="flex w-full max-w-md flex-col items-center"
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <UkelFlourish className="h-8 w-40 opacity-80 sm:h-10 sm:w-52" />
            <p className="mt-2 font-cinzel text-[10px] uppercase tracking-[0.55em] text-jawa-beige/85 sm:text-xs">
              {config.coverLabel}
            </p>
          </motion.div>

          {/* --- tengah: monogram + nama --- */}
          <div className="flex w-full max-w-md flex-col items-center">
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.35, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                {/* cincin monogram */}
                <svg viewBox="0 0 220 220" className="h-32 w-32 sm:h-40 sm:w-40" aria-hidden="true">
                  <circle cx="110" cy="110" r="88" fill="rgba(26,14,8,0.55)" stroke="url(#goldGrad)" strokeWidth="1.4" />
                  <circle cx="110" cy="110" r="78" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.7" />
                  <circle cx="110" cy="110" r="98" fill="none" stroke="url(#goldGrad)" strokeWidth="0.7" opacity="0.45" />
                  {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    return (
                      <circle
                        key={i}
                        cx={110 + Math.cos(a) * 93}
                        cy={110 + Math.sin(a) * 93}
                        r={i % 3 === 0 ? 2.4 : 1.3}
                        fill="url(#goldGrad)"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-script text-3xl leading-none text-shimmer sm:text-[2.6rem]">{monogram}</span>
                </div>
              </div>

              <motion.h1
                className="mt-5 text-center font-cinzeldec text-[1.7rem] leading-[1.15] text-jawa-ivory sm:text-4xl md:text-[2.7rem]"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.95 } } }}
              >
                <span className="sr-only">{`${config.groom.nickname} & ${config.bride.nickname}`}</span>
                <motion.span
                  aria-hidden="true"
                  className="block text-gold-gradient text-gold-glow"
                  variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
                >
                  {config.groom.nickname.toUpperCase()}
                </motion.span>
                <motion.span
                  aria-hidden="true"
                  className="my-1 block font-script text-3xl text-jawa-gold sm:text-4xl"
                  variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { duration: 0.8 } } }}
                >
                  &amp;
                </motion.span>
                <motion.span
                  aria-hidden="true"
                  className="block text-gold-gradient text-gold-glow"
                  variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
                >
                  {config.bride.nickname.toUpperCase()}
                </motion.span>
              </motion.h1>

              <OrnateDivider className="mt-5 opacity-90" />

              <motion.p
                className="mt-3 font-serif text-base tracking-[0.16em] text-jawa-beige sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.7 }}
              >
                {config.weddingDayLabel}, {config.weddingDateLabel}
              </motion.p>
            </motion.div>
          </div>

          {/* --- bawah: nama tamu + tombol --- */}
          <motion.div
            className="flex w-full max-w-sm flex-col items-center gap-4"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full rounded-xl border border-jawa-gold/30 bg-jawa-espresso/60 px-5 py-3 text-center backdrop-blur-sm">
              <p className="font-cinzel text-[9px] uppercase tracking-[0.4em] text-jawa-gold/85 sm:text-[10px]">
                Kepada Yth.
              </p>
              <p className="mt-1 truncate font-serif text-lg font-semibold text-jawa-ivory sm:text-xl">
                {guest.name}
              </p>
              {guest.label && (
                <p className="mt-0.5 font-cinzel text-[9px] uppercase tracking-[0.32em] text-jawa-beige/70">
                  {guest.label}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpen}
              disabled={phase === 'opening'}
              className={cn(
                'gold-sheen group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5',
                'bg-gradient-to-br from-[#EFD8A2] via-[#C6A56B] to-[#8A6A34] text-jawa-chocolate',
                'font-cinzel text-[11px] font-semibold uppercase tracking-[0.26em] sm:text-xs',
                'shadow-[0_0_0_0_rgba(198,165,107,0.6)] transition-all duration-500',
                'hover:shadow-[0_0_38px_-4px_rgba(198,165,107,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-goldlight',
                'active:scale-[0.97] disabled:opacity-70',
              )}
              aria-label="Buka undangan"
            >
              <span className="absolute inset-0 rounded-full animate-pulse-subtle bg-jawa-goldlight/20 blur-md" aria-hidden="true" />
              <MailOpen size={16} className="relative shrink-0" strokeWidth={1.8} />
              <span className="relative">Buka Undangan</span>
            </button>

            {/* Kontrol musik sebelum membuka */}
            {musicEnabled && (
              <button
                type="button"
                onClick={() => setWantsMusic((v) => !v)}
                className="flex items-center gap-2 font-cinzel text-[9px] uppercase tracking-[0.28em] text-jawa-beige/70 transition hover:text-jawa-goldlight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jawa-gold/60 rounded"
                aria-pressed={wantsMusic}
              >
                {wantsMusic ? <Volume2 size={13} /> : <VolumeX size={13} />}
                {wantsMusic ? 'Musik: Aktif' : 'Musik: Mati'}
              </button>
            )}

            <span className="flex items-center gap-1 text-jawa-gold/50">
              <ChevronDown size={14} className="animate-bounce" />
            </span>
          </motion.div>
        </div>

        {/* ===== ORNAMEN BUNGA SUDUT ===== */}
        <motion.div
          className="pointer-events-none absolute -bottom-2 -left-4 w-[62vw] max-w-[380px] sm:w-[34vw]"
          initial={{ opacity: 0, x: -40, y: 30 }}
          animate={{ opacity: 0.95, x: 0, y: 0 }}
          transition={{ duration: 1.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: mouse.x * 8 }}
        >
          <FloralCorner className="h-auto w-full" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute -bottom-2 -right-4 w-[62vw] max-w-[380px] sm:w-[34vw]"
          initial={{ opacity: 0, x: 40, y: 30 }}
          animate={{ opacity: 0.95, x: 0, y: 0 }}
          transition={{ duration: 1.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: mouse.x * -8 }}
        >
          <FloralCorner mirror className="h-auto w-full" />
        </motion.div>

        {/* ===== KELOPAK JATUH ===== */}
        <PetalField count={12} className="z-10" />
      </motion.div>
    </div>
  );
}
