import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Home, Sparkle, Star, Users } from 'lucide-react';
import type { InvitationConfig, LoveStoryItem } from '../../types/invitation';
import { OrnateDivider, UkelFlourish } from '../ornaments/Ornaments';
import { Reveal, SectionShell } from '../ui/primitives';
import { SmartImage } from '../media/SmartImage';
import { Lightbox } from '../media/Lightbox';
import { cn } from '../../lib/utils';

/* ==========================================================================
 *  SECTION 7 — KISAH CINTA (timeline)
 * ======================================================================== */

const STORY_ICONS = {
  meet: Users,
  heart: Heart,
  ring: Sparkle,
  home: Home,
  star: Star,
} as const;

function StoryNode({ item, index }: { item: LoveStoryItem; index: number }) {
  const reduce = useReducedMotion();
  const Icon = STORY_ICONS[item.icon] ?? Star;
  const isLeft = index % 2 === 0;

  return (
    <li className="relative pl-14 sm:pl-0">
      {/* Garis & simpul (mobile: satu kolom kiri) */}
      <span
        className="absolute left-[22px] top-0 h-full w-px bg-gradient-to-b from-transparent via-jawa-gold/45 to-transparent sm:left-1/2"
        aria-hidden="true"
      />
      <motion.span
        className="absolute left-[13px] top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-jawa-gold/70 bg-jawa-espresso sm:left-1/2 sm:-translate-x-1/2"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.55, delay: reduce ? 0 : 0.15 }}
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-jawa-gold" />
      </motion.span>

      {/* Kartu */}
      <div
        className={cn(
          'sm:w-[46%]',
          isLeft ? 'sm:mr-auto sm:pr-10 sm:text-right' : 'sm:ml-auto sm:pl-10 sm:text-left',
        )}
      >
        <Reveal y={26} delay={0.05}>
          <div className="glass-royal-card glass-royal-card-hover relative rounded-2xl p-5 sm:p-6">
            <div
              className={cn(
                'flex items-center gap-3',
                isLeft ? 'sm:flex-row-reverse sm:justify-start' : 'justify-start',
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-jawa-gold/50 bg-jawa-gold/10 text-jawa-goldlight">
                <Icon size={15} />
              </span>
              <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                {item.dateLabel}
              </span>
            </div>
            <h3 className="mt-3 font-cinzeldec text-xl text-jawa-ivory sm:text-2xl">{item.title}</h3>
            <p className="mt-2 font-serif text-sm leading-[1.85] text-jawa-beige/85 sm:text-[0.95rem]">
              {item.description}
            </p>
          </div>
        </Reveal>
      </div>
    </li>
  );
}

export function LoveStorySection({ config }: { config: InvitationConfig }) {
  const { loveStory } = config;
  if (!loveStory.enabled || loveStory.items.length === 0) return null;

  return (
    <SectionShell
      id="kisah"
      eyebrow="Lelakon Katresnan"
      title={loveStory.title}
      subtitle={loveStory.subtitle}
      motif="ukiran"
      motifOpacity={0.06}
    >
      <ol className="relative flex flex-col gap-10 sm:gap-4">
        {/* Garis vertikal tengah untuk desktop (di atas, sebagai aksen) */}
        <span
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-jawa-gold/25 to-transparent sm:block"
          aria-hidden="true"
        />
        {loveStory.items.map((item, i) => (
          <StoryNode key={item.id} item={item} index={i} />
        ))}
      </ol>

      <Reveal delay={0.15} className="mt-14 text-center">
        <OrnateDivider />
        <p className="mx-auto mt-6 max-w-lg font-serif text-sm italic leading-relaxed text-jawa-beige/75 sm:text-base">
          “Tresna iku ora mung rasa, nanging uga laku. Mula kita mlaku bebarengan.”
        </p>
      </Reveal>

      <UkelFlourish className="pointer-events-none absolute left-0 top-24 h-auto w-40 opacity-20" />
      <UkelFlourish mirror className="pointer-events-none absolute right-0 top-24 h-auto w-40 opacity-20" />
    </SectionShell>
  );
}

/* ==========================================================================
 *  SECTION 8 — GALERI
 * ======================================================================== */

/** Pola ukuran masonry: foto ke-1, ke-6, dst. lebih tinggi. */
const SPAN_PATTERN = [
  'sm:row-span-2',
  '',
  'sm:row-span-2',
  '',
  'sm:row-span-2',
  '',
];

export function GallerySection({ config }: { config: InvitationConfig }) {
  const { gallery } = config;
  const [index, setIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (!gallery.enabled || gallery.photos.length === 0) return null;

  const visible = expanded ? gallery.photos : gallery.photos.slice(0, 6);

  return (
    <SectionShell
      id="galeri"
      eyebrow="Potret"
      title={gallery.title}
      subtitle={gallery.subtitle}
      motif="parang"
      motifOpacity={0.05}
      width="wide"
    >
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[168px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[186px]">
        {visible.map((photo, i) => (
          <Reveal
            key={photo.id}
            delay={(i % 3) * 0.08}
            y={22}
            className={cn('min-h-0', SPAN_PATTERN[i % SPAN_PATTERN.length])}
          >
            <button
              type="button"
              onClick={() => setIndex(gallery.photos.findIndex((p) => p.id === photo.id))}
              className="group relative block h-full w-full overflow-hidden rounded-xl border border-jawa-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
              aria-label={`Buka foto: ${photo.alt}`}
            >
              <SmartImage
                src={photo.thumb ?? photo.src}
                alt={photo.alt}
                ratio="auto"
                className="h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.07]"
                monogramSeed={[config.groom.nickname[0], config.bride.nickname[0]]}
                sizes="(max-width: 640px) 45vw, 30vw"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-jawa-espresso/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {photo.caption && (
                <span className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-2 font-serif text-[11px] italic text-jawa-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-xs">
                  {photo.caption}
                </span>
              )}
              <span className="pointer-events-none absolute right-2 top-2 rounded-full border border-jawa-gold/50 bg-jawa-espresso/70 px-2 py-0.5 font-cinzel text-[9px] uppercase tracking-widest text-jawa-goldlight opacity-0 transition group-hover:opacity-100">
                lihat
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {gallery.photos.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-jawa-gold/50 px-6 py-2.5 font-cinzel text-[10px] uppercase tracking-[0.28em] text-jawa-goldlight transition hover:bg-jawa-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/60"
          >
            {expanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${gallery.photos.length})`}
          </button>
        </div>
      )}

      <Lightbox photos={gallery.photos} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </SectionShell>
  );
}
