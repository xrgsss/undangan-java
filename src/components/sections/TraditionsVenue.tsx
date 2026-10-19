import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Car, ChevronDown, Info, MapPin, Navigation, ParkingCircle, Train, ExternalLink } from 'lucide-react';
import type { InvitationConfig } from '../../types/invitation';
import { JogloScene } from '../ornaments/JogloScene';
import { Gunungan } from '../ornaments/Gunungan';
import { CornFrameWrap, BatikBackdrop } from './decor';
import { OrnateDivider, UkelFlourish, BatikPanel } from '../ornaments/Ornaments';
import { GoldButton, GoldPill, Reveal, SectionShell } from '../ui/primitives';
import { WayangShadow } from '../ornaments/WayangFigure';
import { cn } from '../../lib/utils';

/* ==========================================================================
 *  SECTION 9 — ADAT & TRADISI JAWA
 *  Disusun sebagai bagian editorial sinematik dengan ilustrasi Joglo.
 * ======================================================================== */

export function TraditionsSection({ config }: { config: InvitationConfig }) {
  const { traditions } = config;
  const [openId, setOpenId] = useState<string | null>(traditions.items[0]?.id ?? null);

  if (!traditions.enabled || traditions.items.length === 0) return null;
  const active = traditions.items.filter((t) => t.enabled);

  return (
    <section id="adat" className="relative scroll-mt-20">
      {/* ===== Banner sinematik Joglo ===== */}
      <div className="relative">
        <JogloScene className="h-[46vh] min-h-[280px] w-full sm:h-[58vh]" />

        {/* Overlay judul */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-jawa-espresso/70 via-transparent to-jawa-espresso">
          <Reveal y={20} className="px-6 text-center">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.5em] text-jawa-gold/90 sm:text-xs">
              Warisan Leluhur
            </p>
            <h2 className="mt-4 font-cinzeldec text-3xl text-gold-gradient text-gold-glow sm:text-5xl">
              {traditions.title}
            </h2>
            <p className="mt-3 font-serif text-sm italic text-jawa-beige/85 sm:text-base">
              {traditions.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Wayang di sisi banner */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-[26%] max-w-[150px] opacity-45 sm:w-[16%]">
          <WayangShadow variant="arjuna" className="h-auto w-full" />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 w-[26%] max-w-[150px] opacity-45 sm:w-[16%]">
          <WayangShadow variant="srikandi" mirror className="h-auto w-full" />
        </div>
      </div>

      {/* ===== Daftar prosesi ===== */}
      <div className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
        <BatikPanel motif="ukiran" opacity={0.07} />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          {/* Kolom ilustrasi (sticky di desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <div className="relative">
                <CornFrameWrap>
                  <div className="bg-batik-parang relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-jawa-deepbrown">
                    <BatikBackdrop opacity={0.1} />
                    <Gunungan className="relative h-[86%] w-auto" />
                  </div>
                </CornFrameWrap>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-7 text-center lg:text-left">
              <p className="font-serif text-sm leading-[1.95] text-jawa-beige/85">
                Rangkaian prosesi adat Jawa bukan sekadar seremonial — ia adalah doa yang
                diwariskan turun-temurun, disampaikan melalui simbol dan laku.
              </p>
            </Reveal>
          </div>

          {/* Akordeon prosesi */}
          <div>
            <Reveal>
              <OrnateDivider className="mb-8 lg:justify-start" label={`${active.length} Prosesi`} />
            </Reveal>

            <ul className="flex flex-col gap-3">
              {active.map((item, i) => {
                const open = openId === item.id;
                return (
                  <Reveal key={item.id} delay={Math.min(i * 0.05, 0.3)} y={18}>
                    <li
                      className={cn(
                        'overflow-hidden rounded-2xl border transition-colors duration-400',
                        open
                          ? 'border-jawa-gold/60 bg-jawa-espresso/75'
                          : 'border-jawa-gold/20 bg-jawa-espresso/45 hover:border-jawa-gold/45',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : item.id)}
                        aria-expanded={open}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/60 sm:px-6"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-jawa-gold/45 font-cinzel text-xs text-jawa-gold">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">
                          <span className="block font-cinzel text-[1.02rem] text-jawa-ivory sm:text-lg">
                            {item.name}
                          </span>
                          {item.javaneseName && item.javaneseName !== item.name && (
                            <span className="mt-0.5 block font-serif text-xs italic text-jawa-gold/80">
                              {item.javaneseName}
                            </span>
                          )}
                        </span>
                        <ChevronDown
                          size={18}
                          className={cn(
                            'shrink-0 text-jawa-gold transition-transform duration-400',
                            open && 'rotate-180',
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <p className="px-5 pb-5 font-serif text-sm leading-[1.95] text-jawa-beige/85 sm:px-6 sm:pl-[72px] sm:text-[0.95rem]">
                              {item.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  </Reveal>
                );
              })}
            </ul>

            {/* Disclaimer kehormatan adat */}
            <Reveal delay={0.2} className="mt-8">
              <div className="flex items-start gap-3 rounded-2xl border border-jawa-gold/25 bg-jawa-espresso/50 px-5 py-4">
                <Info size={16} className="mt-0.5 shrink-0 text-jawa-gold" />
                <p className="font-serif text-xs italic leading-relaxed text-jawa-beige/75 sm:text-sm">
                  {traditions.disclaimer}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="mt-6 flex flex-wrap gap-3">
              <GoldPill>
                <Gunungan flames={false} glow={false} className="h-3 w-auto" /> Gunungan
              </GoldPill>
              <GoldPill>Batik Parang</GoldPill>
              <GoldPill>Batik Kawung</GoldPill>
              <GoldPill>Batik Truntum</GoldPill>
            </Reveal>
          </div>
        </div>

        <UkelFlourish className="pointer-events-none absolute bottom-6 left-0 h-auto w-44 opacity-20" />
        <UkelFlourish mirror className="pointer-events-none absolute bottom-6 right-0 h-auto w-44 opacity-20" />
      </div>
    </section>
  );
}

/* ==========================================================================
 *  SECTION 10 — LOKASI ACARA
 * ======================================================================== */

const DIRECTION_ICONS = [Car, Train, Navigation] as const;

export function VenueSection({ config }: { config: InvitationConfig }) {
  const { venue } = config;
  const primary = config.events[0];
  const [mapLoaded, setMapLoaded] = useState(false);

  if (!primary) return null;
  const fullAddress = `${primary.venueName}, ${primary.address}, ${primary.city}`;

  return (
    <SectionShell
      id="lokasi"
      eyebrow="Papan Panggonan"
      title={venue.title}
      subtitle={venue.subtitle}
      motif="kawung"
      motifOpacity={0.06}
      width="wide"
    >
      <Reveal>
        <p className="mx-auto max-w-2xl text-center font-serif text-sm leading-[1.95] text-jawa-beige/85 sm:text-base">
          {venue.description}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        {/* Peta */}
        <Reveal className="order-2 lg:order-1">
          <div className="gold-frame relative overflow-hidden rounded-2xl bg-jawa-deepbrown">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              {primary.mapsEmbedUrl && mapLoaded ? (
                <iframe
                  title={`Peta lokasi ${primary.venueName}`}
                  src={primary.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.35] contrast-[1.05]"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-batik-kawung bg-jawa-deepbrown px-6 text-center">
                  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
                    <rect width="100%" height="100%" fill="url(#batikKawung)" color="#C6A56B" />
                  </svg>
                  <MapPin size={28} className="relative text-jawa-gold" />
                  <div className="relative">
                    <p className="font-cinzel text-base text-jawa-ivory">{primary.venueName}</p>
                    <p className="mt-1 font-serif text-sm text-jawa-beige/80">{primary.city}</p>
                  </div>
                  {primary.mapsEmbedUrl ? (
                    <GoldButton size="sm" onClick={() => setMapLoaded(true)} className="relative">
                      <MapPin size={13} /> Muat Peta
                    </GoldButton>
                  ) : (
                    <GoldButton
                      size="sm"
                      href={primary.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative"
                    >
                      <ExternalLink size={13} /> Buka di Google Maps
                    </GoldButton>
                  )}
                  <p className="relative max-w-xs font-serif text-[11px] italic text-jawa-beige/55">
                    Peta dimuat hanya saat diminta agar halaman undangan tetap ringan.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-jawa-gold/25 bg-jawa-espresso/70 px-4 py-3">
              <p className="font-serif text-xs text-jawa-beige/85 sm:text-sm">{fullAddress}</p>
              <GoldButton size="sm" variant="outline" href={primary.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation size={13} /> Arah
              </GoldButton>
            </div>
          </div>
        </Reveal>

        {/* Petunjuk arah */}
        <Reveal delay={0.14} className="order-1 lg:order-2">
          <div className="flex h-full flex-col gap-4">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.36em] text-jawa-gold">
              Panduan Menuju Lokasi
            </p>

            {venue.directions.map((d, i) => {
              const Icon = DIRECTION_ICONS[i % DIRECTION_ICONS.length];
              return (
                <div
                  key={d.id}
                  className="glass-royal-card glass-royal-card-hover flex gap-4 rounded-2xl px-4 py-4 sm:px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-jawa-gold/45 bg-jawa-gold/10 text-jawa-goldlight">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="font-cinzel text-sm text-jawa-ivory">{d.label}</p>
                    <p className="mt-1 font-serif text-[13px] leading-relaxed text-jawa-beige/80 sm:text-sm">
                      {d.detail}
                    </p>
                  </div>
                </div>
              );
            })}

            {venue.parking && (
              <div className="mt-auto flex items-start gap-3 rounded-2xl border border-jawa-gold/25 bg-jawa-espresso/50 px-4 py-4">
                <ParkingCircle size={18} className="mt-0.5 shrink-0 text-jawa-gold" />
                <p className="font-serif text-[13px] leading-relaxed text-jawa-beige/80 sm:text-sm">
                  {venue.parking}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
