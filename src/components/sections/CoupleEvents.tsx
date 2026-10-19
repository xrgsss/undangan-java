import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarPlus,
  Check,
  Clock,
  Copy,
  AtSign,
  MapPin,
  Maximize2,
  Sparkles,
  Users,
} from 'lucide-react';
import type { EventSchedule, InvitationConfig, PersonProfile } from '../../types/invitation';
import { Gunungan } from '../ornaments/Gunungan';
import { FloralCorner, OrnateDivider, UkelFlourish } from '../ornaments/Ornaments';
import { WayangShadow } from '../ornaments/WayangFigure';
import { GoldButton, GoldPill, Reveal, SectionShell, StaggerText } from '../ui/primitives';
import { SmartImage } from '../media/SmartImage';
import { copyToClipboard, formatLongDateID, googleCalendarUrl } from '../../lib/utils';
import { useCountdown } from '../../hooks/useCountdown';

/* ==========================================================================
 *  SECTION 4 — PROFIL PENGANTIN
 * ======================================================================== */

function CoupleCard({
  person,
  role,
  onZoom,
}: {
  person: PersonProfile;
  role: string;
  onZoom: (p: PersonProfile) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Reveal y={34}>
        <div className="relative">
          {/* bingkai klasik berukir emas */}
          <div className="absolute -inset-3 rounded-[1.6rem] border border-jawa-gold/40 sm:-inset-4" aria-hidden="true" />
          <div className="absolute -inset-5 rounded-[1.8rem] border border-jawa-gold/20 sm:-inset-6" aria-hidden="true" />
          <span className="absolute -left-3 -top-3 z-10 h-6 w-6 border-l-2 border-t-2 border-jawa-gold/70" aria-hidden="true" />
          <span className="absolute -right-3 -top-3 z-10 h-6 w-6 border-r-2 border-t-2 border-jawa-gold/70" aria-hidden="true" />
          <span className="absolute -bottom-3 -left-3 z-10 h-6 w-6 border-b-2 border-l-2 border-jawa-gold/70" aria-hidden="true" />
          <span className="absolute -bottom-3 -right-3 z-10 h-6 w-6 border-b-2 border-r-2 border-jawa-gold/70" aria-hidden="true" />

          <button
            type="button"
            onClick={() => onZoom(person)}
            className="group relative block cursor-zoom-in rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
            aria-label={`Perbesar foto ${person.nickname}`}
          >
            <SmartImage
              src={person.photo}
              alt={person.photoAlt}
              ratio="4/5"
              className="w-56 rounded-[1.25rem] sm:w-64"
              imgClassName="group-hover:scale-[1.04]"
              monogramSeed={[person.nickname]}
              sizes="(max-width: 640px) 224px, 256px"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-jawa-gold/50 bg-jawa-espresso/80 p-1.5 text-jawa-goldlight opacity-0 transition group-hover:opacity-100">
              <Maximize2 size={12} />
            </span>
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-9">
        <GoldPill>{role}</GoldPill>
        <StaggerText
          as="h3"
          text={person.nickname}
          className="mt-4 font-script text-4xl text-shimmer sm:text-5xl"
        />
        <p className="mt-2 font-cinzel text-base text-jawa-ivory sm:text-lg">{person.fullName}</p>
        <p className="mt-4 font-serif text-sm italic leading-relaxed text-jawa-beige/80">
          {person.childOrder}
        </p>
        <p className="mt-1 font-serif text-sm leading-relaxed text-jawa-beige/90">
          {person.father}
          <br />
          {person.mother}
        </p>

        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-jawa-gold/40 px-4 py-2 font-cinzel text-[10px] uppercase tracking-[0.24em] text-jawa-goldlight transition hover:border-jawa-gold hover:bg-jawa-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/60"
          >
            <AtSign size={13} />@{person.instagram}
          </a>
        )}
      </Reveal>
    </div>
  );
}

export function CoupleSection({ config }: { config: InvitationConfig }) {
  const [openPhoto, setOpenPhoto] = useState<PersonProfile | null>(null);

  return (
    <SectionShell
      id="mempelai"
      eyebrow="Sugeng Pinanggih"
      title="Mempelai"
      subtitle="Ridho Allah dan restu kedua orang tua adalah jalan kami menuju pelaminan."
      motif="kawung"
      motifOpacity={0.07}
    >
      <div className="grid gap-16 sm:gap-20 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-8">
        <CoupleCard person={config.groom} role="Mempelai Pria" onZoom={setOpenPhoto} />

        {/* Ornamen pemisah di tengah */}
        <div className="flex flex-row items-center justify-center gap-6 lg:flex-col lg:pt-24" aria-hidden="true">
          <span className="hidden h-24 w-px bg-gradient-to-b from-transparent via-jawa-gold/60 to-transparent lg:block" />
          <div className="relative flex flex-col items-center">
            <WayangShadow variant="arjuna" className="h-16 w-auto opacity-60 lg:hidden" />
            <span className="font-script text-4xl text-jawa-gold">weds</span>
            <Gunungan flames={false} glow={false} className="mt-1 hidden w-16 opacity-90 lg:block" />
          </div>
          <span className="hidden h-24 w-px bg-gradient-to-b from-transparent via-jawa-gold/60 to-transparent lg:block" />
        </div>

        <CoupleCard person={config.bride} role="Mempelai Wanita" onZoom={setOpenPhoto} />
      </div>

      <Reveal delay={0.2} className="mt-14 flex flex-col items-center gap-4">
        <OrnateDivider />
        <p className="max-w-xl text-center font-serif text-sm italic leading-relaxed text-jawa-beige/75 sm:text-base">
          Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
          menyaksikan janji suci kami.
        </p>
      </Reveal>

      {/* Lightbox foto profil */}
      {openPhoto && (
        <button
          type="button"
          onClick={() => setOpenPhoto(null)}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-jawa-espresso/95 p-6 backdrop-blur"
          aria-label="Tutup foto"
        >
          <img
            src={openPhoto.photo}
            alt={openPhoto.photoAlt}
            className="max-h-[80vh] max-w-full rounded-xl border border-jawa-gold/40 object-contain"
          />
        </button>
      )}
    </SectionShell>
  );
}

/* ==========================================================================
 *  SECTION 5 — DETAIL ACARA
 * ======================================================================== */

function EventCard({ event, monogramSeed }: { event: EventSchedule; monogramSeed: string[] }) {
  const [copied, setCopied] = useState(false);
  const fullAddress = `${event.venueName}, ${event.address}, ${event.city}`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(fullAddress);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const calendarUrl = googleCalendarUrl({
    title: `${event.name} — ${monogramSeed.join(' & ')}`,
    details: event.note ?? '',
    location: fullAddress,
    startISO: event.startISO,
    endISO: event.endISO ?? event.startISO,
  });

  return (
    <Reveal className="h-full">
      <article className="gold-frame glass-royal-card glass-royal-card-hover relative flex h-full flex-col overflow-hidden rounded-3xl px-6 py-9 text-center sm:px-8">
        {/* latar batik */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]" aria-hidden="true">
          <rect width="100%" height="100%" fill="url(#batikTruntum)" color="#C6A56B" />
        </svg>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jawa-gold/70 to-transparent" />

        <div className="relative">
          <p className="font-cinzel text-[10px] uppercase tracking-[0.42em] text-jawa-gold/85">
            {event.subtitle}
          </p>
          <h3 className="mt-3 font-cinzeldec text-2xl text-gold-gradient sm:text-3xl">{event.name}</h3>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-jawa-gold/50" />
            <Sparkles size={14} className="text-jawa-gold" />
            <span className="h-px w-10 bg-jawa-gold/50" />
          </div>

          <p className="mt-6 font-cinzel text-lg text-jawa-ivory sm:text-xl">
            {formatLongDateID(event.startISO)}
          </p>
          <p className="mt-2 inline-flex items-center gap-2 font-serif text-base text-jawa-beige">
            <Clock size={14} className="text-jawa-gold" />
            {event.timeLabel} {event.timezone}
          </p>

          <div className="mt-7 rounded-2xl border border-jawa-gold/25 bg-jawa-espresso/50 px-4 py-5 text-left">
            <p className="flex items-start gap-2 font-cinzel text-sm text-jawa-goldlight">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>{event.venueName}</span>
            </p>
            <p className="mt-2 pl-[23px] font-serif text-sm leading-relaxed text-jawa-beige/85">
              {event.address}
              <br />
              {event.city}
            </p>
            {event.note && (
              <p className="mt-3 pl-[23px] font-serif text-xs italic text-jawa-beige/60">{event.note}</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <GoldButton href={event.mapsUrl} target="_blank" rel="noopener noreferrer" size="sm" variant="solid">
              <MapPin size={13} /> Petunjuk Arah
            </GoldButton>
            <GoldButton size="sm" variant="outline" onClick={handleCopy} ariaLabel="Salin alamat acara">
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Tersalin' : 'Salin Alamat'}
            </GoldButton>
            <GoldButton
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="ghost"
            >
              <CalendarPlus size={13} /> Simpan Tanggal
            </GoldButton>
          </div>

          <span className="sr-only">{`Alamat acara ${event.name} di ${fullAddress}`}</span>
        </div>
      </article>
    </Reveal>
  );
}

export function EventsSection({ config }: { config: InvitationConfig }) {
  const seed = [config.groom.nickname, config.bride.nickname];

  return (
    <SectionShell
      id="acara"
      eyebrow="Rantaman Adicara"
      title="Detail Acara"
      subtitle="Dengan penuh sukacita kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada rangkaian acara berikut."
      motif="parang"
      motifOpacity={0.06}
      width="wide"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {config.events.map((event) => (
          <EventCard key={event.id} event={event} monogramSeed={seed} />
        ))}
      </div>

      {/* Ornamen bunga bawah */}
      <div className="pointer-events-none relative mt-10 h-16 sm:h-24" aria-hidden="true">
        <FloralCorner className="absolute -bottom-10 left-1/2 h-auto w-[70%] -translate-x-1/2 opacity-45 sm:w-[46%]" />
      </div>
    </SectionShell>
  );
}

/* ==========================================================================
 *  SECTION 6 — COUNTDOWN
 * ======================================================================== */

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative flex min-w-[68px] flex-col items-center rounded-2xl border border-jawa-gold/35 bg-jawa-espresso/65 px-3 py-4 backdrop-blur-sm sm:min-w-[92px] sm:px-5 sm:py-5">
      <span className="pointer-events-none absolute inset-x-2 top-1 h-px bg-gradient-to-r from-transparent via-jawa-gold/50 to-transparent" />
      <span className="pointer-events-none absolute inset-x-2 bottom-1 h-px bg-gradient-to-r from-transparent via-jawa-gold/50 to-transparent" />
      <span className="font-cinzeldec text-2xl tabular-nums text-gold-gradient sm:text-4xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1.5 font-cinzel text-[9px] uppercase tracking-[0.28em] text-jawa-beige/75 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export function CountdownSection({ config }: { config: InvitationConfig }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(config.weddingDateISO);

  const statusText = () => {
    if (!isPast) return 'Menuju hari bahagia';
    const end = config.events[config.events.length - 1]?.endISO;
    // Dibaca saat render dengan sengaja: status bergantung pada waktu nyata.
    // oxlint-disable-next-line react/purity
    if (end && Date.now() < new Date(end).getTime()) return 'Acara sedang berlangsung';
    return 'Alhamdulillah, acara telah terlaksana';
  };

  return (
    <section id="countdown" className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-jawa-espresso via-jawa-deepbrown/70 to-jawa-espresso" aria-hidden="true" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
        <rect width="100%" height="100%" fill="url(#batikKawung)" color="#C6A56B" />
      </svg>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <OrnateDivider className="mb-7" />
          <p className="font-cinzel text-[10px] uppercase tracking-[0.45em] text-jawa-gold sm:text-xs">
            {statusText()}
          </p>
          <h2 className="mt-4 font-cinzeldec text-3xl text-gold-gradient sm:text-4xl md:text-[2.75rem]">
            {isPast ? 'Tresna kang Kawujud' : 'Menghitung Hari'}
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-9">
          {isPast ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="gold-frame-double mx-auto max-w-lg rounded-3xl bg-jawa-espresso/70 px-6 py-9"
            >
              <Gunungan className="mx-auto h-20 w-auto" />
              <p className="mt-5 font-serif text-lg italic leading-relaxed text-jawa-ivory">
                “Matur nuwun dhumateng sedaya kanca lan kadang ingkang sampun paring donga restu.”
              </p>
              <p className="mt-4 font-cinzel text-xs uppercase tracking-[0.32em] text-jawa-gold">
                {config.weddingDayLabel}, {config.weddingDateLabel}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <CountUnit value={days} label="Hari" />
              <CountUnit value={hours} label="Jam" />
              <CountUnit value={minutes} label="Menit" />
              <CountUnit value={seconds} label="Detik" />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.3} className="mt-9">
          <p className="inline-flex items-center gap-2 font-serif text-sm text-jawa-beige/85 sm:text-base">
            <Users size={14} className="text-jawa-gold" />
            {formatLongDateID(config.weddingDateISO)} · {config.events[0]?.timeLabel} {config.events[0]?.timezone}
          </p>
        </Reveal>
      </div>

      <UkelFlourish className="pointer-events-none absolute -left-10 bottom-4 h-auto w-52 opacity-25" />
      <UkelFlourish mirror className="pointer-events-none absolute -right-10 bottom-4 h-auto w-52 opacity-25" />
    </section>
  );
}
