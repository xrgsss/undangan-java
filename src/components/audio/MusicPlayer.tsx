import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music2, Volume1, Volume2, VolumeX } from 'lucide-react';
import type { MusicPlayerApi } from '../../hooks/useMusicPlayer';
import { cn } from '../../lib/utils';

/**
 * Pemutar musik latar.
 *  · Tombol bulat di kanan atas dengan visualisasi batang yang benar-benar
 *    mengikuti amplitudo audio (bukan animasi palsu) saat memakai gamelan
 *    sintetis; memakai osilasi lembut saat memakai berkas audio pengguna.
 *  · Panel volume terbuka saat tombol ditekan lama / diklik ganda, dan
 *    otomatis tertutup bila pengguna menekan di luar panel.
 */
export function MusicPlayer({
  player,
  visible,
}: {
  player: MusicPlayerApi;
  visible: boolean;
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest('[data-music-panel]')) setPanelOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [panelOpen]);

  if (!player.ready) return null;

  const VolumeIcon = player.volume === 0 ? VolumeX : player.volume < 0.5 ? Volume1 : Volume2;
  // Skala visual 0..1 → tinggi batang 15%..100%
  const bars = [0.55, 0.85, 0.7, 1, 0.62].map((k) => Math.max(0.14, Math.min(1, player.level * 2.1 * k)));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="fixed right-3 top-3 z-50 flex flex-col items-end gap-2 sm:right-5 sm:top-5"
        >
          <div className="flex items-center gap-2">
            {/* Batang visualisasi */}
            <span
              className="hidden h-8 items-end gap-[2px] rounded-full border border-jawa-gold/30 bg-jawa-espresso/70 px-2 pb-1.5 pt-1.5 sm:flex"
              aria-hidden="true"
            >
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  className="block w-[3px] rounded-full bg-gradient-to-t from-jawa-golddark to-jawa-goldlight"
                  animate={{ height: player.isPlaying ? `${h * 100}%` : '16%' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                />
              ))}
            </span>

            <button
              type="button"
              data-music-panel
              onClick={() => void player.toggle()}
              onDoubleClick={() => setPanelOpen((v) => !v)}
              onContextMenu={(e) => {
                e.preventDefault();
                setPanelOpen((v) => !v);
              }}
              aria-pressed={player.isPlaying}
              aria-label={player.isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
              title={`${player.title} — ${player.artist}`}
              className={cn(
                'group relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70',
                player.isPlaying
                  ? 'border-jawa-gold/70 bg-jawa-gold/20 text-jawa-goldlight shadow-[0_0_28px_-6px_rgba(198,165,107,0.9)]'
                  : 'border-jawa-gold/40 bg-jawa-espresso/80 text-jawa-beige/70 hover:text-jawa-goldlight',
              )}
            >
              {player.isPlaying && (
                <span
                  className="absolute inset-0 -z-10 rounded-full bg-jawa-gold/25 blur-md"
                  style={{ opacity: 0.35 + player.level * 0.5 }}
                  aria-hidden="true"
                />
              )}
              <Music2 size={17} className={player.isPlaying ? 'animate-pulse-subtle' : undefined} />
            </button>

            {/* Tombol pengaturan volume */}
            <button
              type="button"
              data-music-panel
              onClick={() => setPanelOpen((v) => !v)}
              aria-expanded={panelOpen}
              aria-label="Atur volume musik"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-jawa-gold/30 bg-jawa-espresso/75 text-jawa-beige/70 transition hover:text-jawa-goldlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
            >
              <VolumeIcon size={14} />
            </button>
          </div>

          <AnimatePresence>
            {panelOpen && (
              <motion.div
                data-music-panel
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="w-60 rounded-2xl border border-jawa-gold/35 bg-jawa-espresso/92 p-4 shadow-[0_18px_50px_-16px_rgba(0,0,0,0.95)] backdrop-blur-md"
              >
                <p className="font-cinzel text-[11px] leading-snug text-jawa-ivory">{player.title}</p>
                <p className="mt-0.5 font-serif text-[11px] italic text-jawa-beige/60">
                  {player.artist}
                  {!player.usingFile && ' · gamelan sintetis'}
                </p>

                <label htmlFor="music-volume" className="mt-4 block font-cinzel text-[9px] uppercase tracking-[0.3em] text-jawa-gold">
                  Volume
                </label>
                <input
                  id="music-volume"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(player.volume * 100)}
                  onChange={(e) => player.setVolume(Number(e.target.value) / 100)}
                  className="mt-2 w-full accent-[#C6A56B]"
                  aria-label="Volume musik"
                />

                <p className="mt-3 font-serif text-[10.5px] italic leading-relaxed text-jawa-beige/55">
                  {player.usingFile
                    ? 'Musik dimuat dari berkas milik pemilik undangan.'
                    : 'Gamelan disintesis langsung di peramban — bebas royalti dan tetap berbunyi tanpa internet.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
