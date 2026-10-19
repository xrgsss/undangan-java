import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Heart,
  Loader2,
  MessageSquareHeart,
  Send,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import type { GuestContext, InvitationConfig, RsvpEntry, WishEntry } from '../../types/invitation';
import { activeRepository, recallGuestIdentity, rememberGuestIdentity } from '../../lib/repository';
import { isValidName, sanitizeName, sanitizeText, timeAgo, uid } from '../../lib/utils';
import { BatikPanel, OrnateDivider, UkelFlourish } from '../ornaments/Ornaments';
import { GoldButton, GoldPill, Reveal, SectionShell } from '../ui/primitives';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { triggerCelebration } from '../../lib/celebrate';

/* ==========================================================================
 *  SECTION 11 — RSVP
 * ======================================================================== */

const ATTENDANCE_OPTIONS = [
  { value: 'hadir' as const, label: 'Insyaallah Hadir', icon: UserCheck, hint: 'Saya akan hadir' },
  { value: 'ragu' as const, label: 'Masih Ragu', icon: Users, hint: 'Belum dapat memastikan' },
  { value: 'tidak-hadir' as const, label: 'Tidak Hadir', icon: UserMinus, hint: 'Mohon maaf, tidak bisa hadir' },
];

export function RsvpSection({ config, guest }: { config: InvitationConfig; guest: GuestContext }) {
  const { toast } = useToast();
  const identity = useMemo(() => recallGuestIdentity(), []);

  const [name, setName] = useState(identity.name || (guest.name !== 'Bapak/Ibu/Saudara/i' ? guest.name : ''));
  const [guests, setGuests] = useState(1);
  const [attendance, setAttendance] = useState<RsvpEntry['attendance']>('hadir');
  const [session, setSession] = useState(config.events[0]?.name ?? '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ hadir: number; totalGuests: number } | null>(null);

  const refreshSummary = useCallback(async () => {
    const s = await activeRepository.summarize(config.slug);
    setSummary({ hadir: s.hadir, totalGuests: s.totalGuests });
  }, [config.slug]);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  if (!config.rsvp.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = sanitizeName(name);
    if (!isValidName(cleanName)) {
      setError('Mohon tuliskan nama Anda (minimal 2 karakter huruf).');
      setStatus('error');
      return;
    }

    setStatus('sending');
    const result = await activeRepository.createRsvp(config.slug, {
      name: cleanName,
      guests,
      attendance,
      session,
      message: message ? sanitizeText(message, 400) : undefined,
    });

    if (!result.ok) {
      setError(result.error ?? 'Gagal mengirim konfirmasi. Silakan coba lagi.');
      setStatus('error');
      return;
    }

    rememberGuestIdentity(cleanName);
    setStatus('sent');
    setMessage('');
    toast('Terima kasih, konfirmasi Anda tersimpan.', 'success');
    void refreshSummary();
    if (attendance === 'hadir') triggerCelebration();
  };

  const summaryText = summary
    ? `${summary.hadir} tamu telah mengonfirmasi kehadiran (${summary.totalGuests} orang)`
    : null;

  return (
    <SectionShell
      id="rsvp"
      eyebrow="Pawarta Rawuh"
      title={config.rsvp.title}
      subtitle={config.rsvp.deadlineLabel}
      motif="truntum"
      motifOpacity={0.07}
      width="narrow"
    >
      <Reveal>
        <form
          onSubmit={handleSubmit}
          className="gold-frame-double relative rounded-3xl bg-jawa-espresso/65 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10"
          noValidate
        >
          <BatikPanel motif="truntum" opacity={0.06} className="rounded-3xl" />

          <div className="relative flex flex-col gap-6">
            {/* Nama */}
            <div>
              <label htmlFor="rsvp-name" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                Nama Tamu
              </label>
              <input
                id="rsvp-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={60}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tuliskan nama Anda"
                className="w-full rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory placeholder:text-jawa-beige/40 focus:border-jawa-gold focus:outline-none focus:ring-1 focus:ring-jawa-gold/50"
              />
            </div>

            {/* Jumlah tamu */}
            <div>
              <label htmlFor="rsvp-guests" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                Jumlah Tamu
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGuests(n)}
                    aria-pressed={guests === n}
                    className={cn(
                      'h-11 w-11 rounded-xl border font-cinzel text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/60',
                      guests === n
                        ? 'border-jawa-gold bg-jawa-gold/20 text-jawa-goldlight'
                        : 'border-jawa-gold/25 bg-jawa-chocolate/50 text-jawa-beige/75 hover:border-jawa-gold/55',
                    )}
                  >
                    {n}
                  </button>
                ))}
                <input
                  id="rsvp-guests"
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={(e) => setGuests(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                  aria-label="Jumlah tamu"
                  className="h-11 w-20 rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-3 text-center font-cinzel text-sm text-jawa-ivory focus:border-jawa-gold focus:outline-none"
                />
              </div>
              <p className="mt-2 font-serif text-[11px] italic text-jawa-beige/55">
                Masukkan jumlah termasuk Anda sendiri (maks. 20 orang).
              </p>
            </div>

            {/* Status kehadiran */}
            <fieldset>
              <legend className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                Konfirmasi Kehadiran
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {ATTENDANCE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = attendance === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAttendance(opt.value)}
                      aria-pressed={active}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/60',
                        active
                          ? 'border-jawa-gold bg-jawa-gold/15'
                          : 'border-jawa-gold/25 bg-jawa-chocolate/50 hover:border-jawa-gold/55',
                      )}
                    >
                      <Icon size={16} className={active ? 'text-jawa-goldlight' : 'text-jawa-beige/60'} />
                      <span>
                        <span className="block font-cinzel text-[11px] uppercase tracking-wider text-jawa-ivory">
                          {opt.label}
                        </span>
                        <span className="mt-0.5 block font-serif text-[11px] text-jawa-beige/60">{opt.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Sesi acara */}
            {config.events.length > 1 && attendance !== 'tidak-hadir' && (
              <div>
                <label htmlFor="rsvp-session" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                  Akan Hadir Pada
                </label>
                <select
                  id="rsvp-session"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="w-full rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory focus:border-jawa-gold focus:outline-none"
                >
                  {config.events.map((ev) => (
                    <option key={ev.id} value={ev.name} className="bg-jawa-espresso">
                      {ev.name} — {ev.timeLabel} {ev.timezone}
                    </option>
                  ))}
                  <option value="Semua acara" className="bg-jawa-espresso">
                    Semua acara
                  </option>
                </select>
              </div>
            )}

            {/* Pesan */}
            <div>
              <label htmlFor="rsvp-message" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                Pesan <span className="normal-case tracking-normal text-jawa-beige/50">(opsional)</span>
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                maxLength={400}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ucapan singkat untuk kedua mempelai…"
                className="w-full resize-none rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory placeholder:text-jawa-beige/40 focus:border-jawa-gold focus:outline-none focus:ring-1 focus:ring-jawa-gold/50"
              />
              <p className="mt-1 text-right font-cinzel text-[10px] tracking-widest text-jawa-beige/45">
                {message.length}/400
              </p>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-maroonlight/50 bg-maroon/20 px-4 py-3 font-serif text-sm text-jawa-ivory">
                {error}
              </p>
            )}

            <div className="flex flex-col items-center gap-4">
              <GoldButton type="submit" size="lg" disabled={status === 'sending' || status === 'sent'}>
                {status === 'sending' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Mengirim…
                  </>
                ) : status === 'sent' ? (
                  <>
                    <BadgeCheck size={15} /> Terkirim
                  </>
                ) : (
                  <>
                    <Send size={15} /> Kirim Konfirmasi
                  </>
                )}
              </GoldButton>

              {summaryText && (
                <p className="flex items-center gap-2 font-serif text-xs italic text-jawa-beige/65">
                  <UserCheck size={12} className="text-jawa-gold" />
                  {summaryText}
                </p>
              )}
            </div>
          </div>
        </form>
      </Reveal>

      <Reveal delay={0.15} className="mt-6">
        <p className="text-center font-serif text-[11px] italic leading-relaxed text-jawa-beige/55 sm:text-xs">
          Data yang Anda kirim hanya digunakan untuk keperluan acara dan tidak dibagikan
          kepada pihak lain.
        </p>
      </Reveal>
    </SectionShell>
  );
}

/* ==========================================================================
 *  SECTION 12 — UCAPAN & DOA
 * ======================================================================== */

const RELATIONS = ['keluarga', 'teman', 'kolega', 'tetangga', 'lainnya'];

export function WishesSection({ config, guest }: { config: InvitationConfig; guest: GuestContext }) {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<WishEntry[]>(() =>
    config.wishes.seed.map((w) => ({ ...w, id: w.id || uid('wish') })),
  );
  const [name, setName] = useState(
    () => recallGuestIdentity().name || (guest.name !== 'Bapak/Ibu/Saudara/i' ? guest.name : ''),
  );
  const [relation, setRelation] = useState('teman');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filter, setFilter] = useState<'semua' | 'hadir' | 'tidak-hadir' | 'ragu'>('semua');

  const loadWishes = useCallback(async () => {
    const stored = await activeRepository.listWishes(config.slug);
    if (stored.length === 0) return;
    setWishes((prev) => {
      const seedIds = new Set(prev.map((p) => p.id));
      const merged = [...stored.filter((s) => !seedIds.has(s.id)), ...prev];
      return merged.sort((a, b) => b.createdAt - a.createdAt);
    });
  }, [config.slug]);

  useEffect(() => {
    void loadWishes();
  }, [loadWishes]);

  if (!config.wishes.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = sanitizeName(name);
    const cleanMessage = sanitizeText(message, 500);

    if (!isValidName(cleanName)) {
      setError('Mohon tuliskan nama Anda (minimal 2 karakter huruf).');
      return;
    }
    if (cleanMessage.length < 3) {
      setError('Ucapan terlalu pendek. Tuliskan minimal 3 karakter.');
      return;
    }

    setSending(true);
    const result = await activeRepository.createWish(config.slug, {
      name: cleanName,
      relation,
      message: cleanMessage,
      attendance: undefined,
    });
    setSending(false);

    if (!result.ok) {
      setError(result.error ?? 'Gagal mengirim ucapan. Coba lagi.');
      return;
    }

    rememberGuestIdentity(cleanName, relation);
    if (result.data) {
      setWishes((prev) => [result.data as WishEntry, ...prev]);
    }
    setMessage('');
    if (result.error) toast(result.error, 'info');
    else toast('Ucapan Anda telah terkirim. Matur nuwun!', 'success');
  };

  const filtered = wishes.filter((w) => {
    if (filter === 'semua') return true;
    return w.attendance === filter;
  });
  const visible = filtered.slice(0, visibleCount);

  return (
    <SectionShell
      id="ucapan"
      eyebrow="Donga & Pangestu"
      title={config.wishes.title}
      subtitle={config.wishes.subtitle}
      motif="ceplok"
      motifOpacity={0.06}
      width="wide"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
        {/* ---------- Formulir ---------- */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={handleSubmit}
            className="gold-frame rounded-3xl bg-jawa-espresso/65 px-5 py-7 backdrop-blur-sm sm:px-7"
            noValidate
          >
            <div className="mb-5 flex items-center gap-3">
              <MessageSquareHeart size={18} className="text-jawa-gold" />
              <h3 className="font-cinzeldec text-lg text-jawa-ivory">Kirim Ucapan</h3>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="wish-name" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                  Nama
                </label>
                <input
                  id="wish-name"
                  type="text"
                  maxLength={60}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory placeholder:text-jawa-beige/40 focus:border-jawa-gold focus:outline-none focus:ring-1 focus:ring-jawa-gold/50"
                />
              </div>

              <div>
                <label htmlFor="wish-relation" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                  Hubungan
                </label>
                <select
                  id="wish-relation"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base capitalize text-jawa-ivory focus:border-jawa-gold focus:outline-none"
                >
                  {RELATIONS.map((r) => (
                    <option key={r} value={r} className="bg-jawa-espresso capitalize">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="wish-message" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                  Ucapan & Doa
                </label>
                <textarea
                  id="wish-message"
                  rows={4}
                  maxLength={500}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan doa terbaik Anda…"
                  className="w-full resize-none rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory placeholder:text-jawa-beige/40 focus:border-jawa-gold focus:outline-none focus:ring-1 focus:ring-jawa-gold/50"
                />
                <p className="mt-1 text-right font-cinzel text-[10px] tracking-widest text-jawa-beige/45">
                  {message.length}/500
                </p>
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-maroonlight/50 bg-maroon/20 px-4 py-3 font-serif text-sm text-jawa-ivory">
                  {error}
                </p>
              )}

              <GoldButton type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Mengirim…
                  </>
                ) : (
                  <>
                    <Send size={15} /> Kirim Ucapan
                  </>
                )}
              </GoldButton>

              <p className="font-serif text-[11px] italic leading-relaxed text-jawa-beige/50">
                Ucapan dimoderasi secara otomatis. Pesan yang mengandung tautan mencurigakan
                akan disembunyikan hingga ditinjau.
              </p>
            </div>
          </form>
        </Reveal>

        {/* ---------- Daftar ucapan ---------- */}
        <div>
          <Reveal className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['semua', 'hadir', 'ragu', 'tidak-hadir'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFilter(f);
                    setVisibleCount(6);
                  }}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/60',
                    filter === f
                      ? 'border-jawa-gold bg-jawa-gold/15 text-jawa-goldlight'
                      : 'border-jawa-gold/25 text-jawa-beige/70 hover:border-jawa-gold/50',
                  )}
                >
                  {f === 'tidak-hadir' ? 'Tidak Hadir' : f}
                </button>
              ))}
            </div>
            <GoldPill>
              <Heart size={11} /> {filtered.length} Ucapan
            </GoldPill>
          </Reveal>

          {visible.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-jawa-gold/25 bg-jawa-espresso/50 px-6 py-12 text-center">
                <MessageSquareHeart size={24} className="mx-auto text-jawa-gold/70" />
                <p className="mt-3 font-serif text-sm italic text-jawa-beige/70">
                  Belum ada ucapan pada kategori ini. Jadilah yang pertama!
                </p>
              </div>
            </Reveal>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {visible.map((w, i) => (
                  <motion.li
                    key={w.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3) }}
                    className="relative flex flex-col rounded-2xl border border-jawa-gold/30 bg-jawa-ivory/95 px-5 py-4 shadow-[0_14px_36px_-16px_rgba(0,0,0,0.85)]"
                  >
                    <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-jawa-golddark/60 to-transparent" />
                    <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-jawa-golddark/60 to-transparent" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jawa-maroon/12 font-cinzel text-xs font-semibold text-jawa-maroon">
                          {w.name.charAt(0).toUpperCase()}
                        </span>
                        <span>
                          <span className="block font-cinzel text-sm font-semibold text-jawa-chocolate">
                            {w.name}
                          </span>
                          <span className="font-serif text-[11px] capitalize text-jawa-deepbrown/60">
                            {w.relation}
                          </span>
                        </span>
                      </div>
                      {w.attendance === 'hadir' && (
                        <span className="mt-1 shrink-0" title="Konfirmasi hadir">
                          <BadgeCheck size={15} className="text-jawa-maroon/70" />
                        </span>
                      )}
                    </div>

                    <p className="mt-3 flex-1 font-serif text-[13.5px] leading-[1.8] text-jawa-deepbrown/90">
                      {w.message}
                    </p>
                    <p className="mt-3 font-cinzel text-[9px] uppercase tracking-[0.22em] text-jawa-golddark/70">
                      {timeAgo(w.createdAt)}
                    </p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {filtered.length > visibleCount && (
            <div className="mt-6 flex justify-center">
              <GoldButton variant="outline" size="sm" onClick={() => setVisibleCount((c) => c + 6)}>
                Muat Ucapan Lainnya
              </GoldButton>
            </div>
          )}
        </div>
      </div>

      <Reveal delay={0.1} className="mt-14 text-center">
        <OrnateDivider />
      </Reveal>

      <UkelFlourish className="pointer-events-none absolute bottom-8 left-0 h-auto w-40 opacity-20" />
      <UkelFlourish mirror className="pointer-events-none absolute bottom-8 right-0 h-auto w-40 opacity-20" />
    </SectionShell>
  );
}
