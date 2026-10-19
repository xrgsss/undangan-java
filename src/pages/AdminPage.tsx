import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  HelpCircle,
  RefreshCw,
  Trash2,
  TriangleAlert,
  Users,
  XCircle,
} from 'lucide-react';
import type { RsvpEntry, WishEntry } from '../types/invitation';
import {
  defaultGuest,
  invitationRegistry,
  isConfigured,
  liveInvitations,
} from '../data/invitations';
import { activeRepository } from '../lib/repository';
import { GoldButton, GoldPill, Reveal, SectionShell } from '../components/ui/primitives';
import { OrnamentDefs } from '../components/ornaments/OrnamentDefs';
import { BatikBackdrop } from '../components/sections/decor';
import { OrnateDivider } from '../components/ornaments/Ornaments';
import { formatLongDateID, timeAgo } from '../lib/utils';
import { useToast } from '../components/ui/Toast';

/**
 * ============================================================================
 *  DASBOR TAMU  ·  /admin
 * ============================================================================
 *  Membaca data konfirmasi & ucapan dari repositori aktif.
 *
 *  ⚠️ JUJUR: pada versi demo ini repositori = localStorage, artinya angka di
 *  dasbor HANYA mencerminkan data yang tersimpan di peramban ini. Data tidak
 *  terkirim ke mana pun dan tidak terlihat oleh pasangan di perangkat lain.
 *  Untuk itu diperlukan backend (lihat supabase/schema.sql).
 * ============================================================================
 */
export function AdminPage({ navigate }: { navigate: (to: string) => void }) {
  const invitations = useMemo(() => liveInvitations(), []);
  const [slug, setSlug] = useState(invitations[0]?.slug ?? '');
  const [rsvp, setRsvp] = useState<RsvpEntry[]>([]);
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [summary, setSummary] = useState({ hadir: 0, tidakHadir: 0, ragu: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const config = invitationRegistry[slug];

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    const [r, w, s] = await Promise.all([
      activeRepository.listRsvp(slug),
      activeRepository.listWishes(slug),
      activeRepository.summarize(slug),
    ]);
    setRsvp(r);
    setWishes(w);
    setSummary(s);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  const exportCsv = () => {
    if (rsvp.length === 0) {
      toast('Belum ada data untuk diekspor.', 'info');
      return;
    }
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Nama', 'Jumlah Tamu', 'Kehadiran', 'Sesi', 'Pesan', 'Waktu'],
      ...rsvp.map((r) => [
        r.name,
        r.guests,
        r.attendance,
        r.session ?? '',
        r.message ?? '',
        new Date(r.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map((row) => row.map(escape).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `konfirmasi-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Berkas CSV diunduh.', 'success');
  };

  const clearLocal = async () => {
    try {
      localStorage.removeItem(`uj:rsvp:${slug}`);
      localStorage.removeItem(`uj:wish:${slug}`);
      await load();
      toast('Data lokal pada peramban ini dihapus.', 'success');
    } catch {
      toast('Gagal menghapus data.', 'error');
    }
  };

  const stats = [
    { label: 'Hadir', value: summary.hadir, icon: CheckCircle2, tone: 'text-emerald-300/90' },
    { label: 'Tidak Hadir', value: summary.tidakHadir, icon: XCircle, tone: 'text-jawa-maroonlight' },
    { label: 'Masih Ragu', value: summary.ragu, icon: HelpCircle, tone: 'text-jawa-goldlight' },
    { label: 'Total Tamu', value: summary.totalGuests, icon: Users, tone: 'text-jawa-goldlight' },
  ];

  return (
    <>
      <OrnamentDefs />

      <div className="relative min-h-screen">
        <BatikBackdrop opacity={0.05} motif="ukiran" />

        <header className="relative border-b border-jawa-gold/20 px-5 py-6 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-jawa-gold/40 text-jawa-goldlight transition hover:bg-jawa-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
                aria-label="Kembali ke beranda"
              >
                <ArrowLeft size={15} />
              </button>
              <div>
                <h1 className="font-cinzeldec text-xl text-gold-gradient">Dasbor Tamu</h1>
                <p className="font-serif text-[12px] italic text-jawa-beige/60">
                  Pantau konfirmasi kehadiran dan ucapan.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <GoldButton size="sm" variant="outline" onClick={() => void load()}>
                <RefreshCw size={13} /> Muat Ulang
              </GoldButton>
              <GoldButton size="sm" variant="outline" onClick={exportCsv}>
                <Download size={13} /> Ekspor CSV
              </GoldButton>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-5xl px-5 py-10 sm:px-8">
          {/* Peringatan realistis */}
          <Reveal>
            <div className="flex items-start gap-3 rounded-2xl border border-jawa-gold/30 bg-jawa-espresso/60 px-5 py-4">
              <TriangleAlert size={17} className="mt-0.5 shrink-0 text-jawa-gold" />
              <p className="font-serif text-[13px] leading-relaxed text-jawa-beige/85">
                <span className="font-semibold text-jawa-goldlight">Mode demo.</span> Data di
                bawah dibaca dari penyimpanan lokal peramban ini — bukan dari server. Angka akan
                berbeda di setiap perangkat dan tidak akan terlihat oleh pasangan. Sambungkan{' '}
                <code className="rounded bg-jawa-espresso/70 px-1.5 py-0.5 font-mono text-[11px]">
                  SupabaseRepository
                </code>{' '}
                untuk pemakaian nyata.
              </p>
            </div>
          </Reveal>

          {/* Pemilih undangan */}
          <Reveal delay={0.06} className="mt-8">
            <p className="mb-2 font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
              Pilih Undangan
            </p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {invitations.map((inv) => (
                <button
                  key={inv.slug}
                  type="button"
                  onClick={() => setSlug(inv.slug)}
                  className={
                    'shrink-0 rounded-full border px-4 py-2 font-cinzel text-[10px] uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70 ' +
                    (slug === inv.slug
                      ? 'border-jawa-gold bg-jawa-gold/15 text-jawa-goldlight'
                      : 'border-jawa-gold/30 text-jawa-beige/65 hover:text-jawa-goldlight')
                  }
                >
                  {inv.groom.nickname} &amp; {inv.bride.nickname}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Ringkasan undangan terpilih */}
          {config && (
            <Reveal delay={0.1} className="mt-7">
              <div className="gold-frame rounded-3xl bg-jawa-espresso/60 px-6 py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-cinzeldec text-2xl text-jawa-ivory">
                      {config.groom.nickname} &amp; {config.bride.nickname}
                    </h2>
                    <p className="mt-1.5 font-serif text-sm text-jawa-beige/75">
                      {formatLongDateID(config.weddingDateISO)}
                    </p>
                    <p className="mt-0.5 font-serif text-[12.5px] text-jawa-beige/55">
                      {config.events[0]?.venueName}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="flex flex-wrap gap-2">
                      <GoldPill className="text-[9px]">{config.template}</GoldPill>
                      <GoldPill className="text-[9px]">
                        {config.status === 'published' ? 'Terbit' : 'Pratinjau'}
                      </GoldPill>
                    </div>
                    {!isConfigured(config) && (
                      <span className="flex items-center gap-1.5 rounded-full border border-jawa-maroonlight/50 bg-jawa-maroon/25 px-3 py-1 font-cinzel text-[9px] uppercase tracking-[0.16em] text-jawa-beige">
                        <TriangleAlert size={11} /> Masih data contoh
                      </span>
                    )}
                  </div>
                </div>

                <OrnateDivider className="my-6" />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-jawa-gold/25 bg-jawa-chocolate/45 px-4 py-4"
                      >
                        <Icon size={16} className={s.tone} />
                        <p className="mt-2 font-cinzeldec text-2xl text-jawa-ivory">{s.value}</p>
                        <p className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-jawa-beige/60">
                          {s.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <GoldButton
                    size="sm"
                    onClick={() => navigate(`/r/${config.slug}?to=${encodeURIComponent('Tamu Undangan')}`)}
                  >
                    Buka Undangan
                  </GoldButton>
                  <GoldButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = `${window.location.origin}/r/${config.slug}?to=${encodeURIComponent(
                        'Nama Tamu',
                      )}&label=${encodeURIComponent('Tamu Undangan')}`;
                      void navigator.clipboard?.writeText(link).then(
                        () => toast('Pola tautan disalin.', 'success'),
                        () => toast('Gagal menyalin tautan.', 'error'),
                      );
                    }}
                  >
                    Salin Pola Tautan
                  </GoldButton>
                  <GoldButton size="sm" variant="outline" onClick={() => void clearLocal()}>
                    <Trash2 size={13} /> Hapus Data Lokal
                  </GoldButton>
                </div>
              </div>
            </Reveal>
          )}

          {/* Daftar konfirmasi */}
          <SectionShell
            id="konfirmasi"
            eyebrow="Konfirmasi"
            title="Daftar Kehadiran"
            motif="none"
            width="wide"
          >
            {loading ? (
              <p className="text-center font-serif italic text-jawa-beige/60">Memuat…</p>
            ) : rsvp.length === 0 ? (
              <EmptyState
                text="Belum ada tamu yang mengisi formulir di peramban ini."
                action={() =>
                  navigate(`/r/${slug}?to=${encodeURIComponent('Tamu Undangan')}`)
                }
                actionLabel="Coba Isi Formulir"
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {rsvp.map((r, i) => (
                  <Reveal key={r.id} delay={Math.min(i * 0.04, 0.4)}>
                    <li className="glass-royal-card flex flex-wrap items-start justify-between gap-3 rounded-2xl p-4">
                      <div className="min-w-0">
                        <p className="font-cinzel text-sm text-jawa-ivory">{r.name}</p>
                        <p className="mt-0.5 font-serif text-[12.5px] text-jawa-beige/65">
                          {r.guests} orang{r.session ? ` · ${r.session}` : ''} ·{' '}
                          {timeAgo(r.createdAt)}
                        </p>
                        {r.message && (
                          <p className="mt-2 font-serif text-[13px] italic leading-relaxed text-jawa-beige/80">
                            “{r.message}”
                          </p>
                        )}
                      </div>
                      <span
                        className={
                          'shrink-0 rounded-full border px-3 py-1 font-cinzel text-[9px] uppercase tracking-[0.16em] ' +
                          (r.attendance === 'hadir'
                            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                            : r.attendance === 'tidak-hadir'
                              ? 'border-jawa-maroonlight/50 bg-jawa-maroon/25 text-jawa-beige'
                              : 'border-jawa-gold/40 bg-jawa-gold/10 text-jawa-goldlight')
                        }
                      >
                        {r.attendance === 'hadir'
                          ? 'Hadir'
                          : r.attendance === 'tidak-hadir'
                            ? 'Tidak Hadir'
                            : 'Ragu'}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            )}
          </SectionShell>

          {/* Daftar ucapan */}
          <SectionShell
            id="ucapan-admin"
            eyebrow="Buku Tamu"
            title="Ucapan & Doa"
            motif="none"
            width="wide"
          >
            {wishes.length === 0 ? (
              <EmptyState text="Belum ada ucapan yang tersimpan di peramban ini." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {wishes.map((w, i) => (
                  <Reveal key={w.id} delay={Math.min(i * 0.04, 0.4)}>
                    <div className="glass-royal-card h-full rounded-2xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-cinzel text-sm text-jawa-ivory">{w.name}</p>
                        <span className="font-cinzel text-[9px] uppercase tracking-[0.16em] text-jawa-gold">
                          {w.relation}
                        </span>
                      </div>
                      <p className="mt-2 font-serif text-[13.5px] italic leading-relaxed text-jawa-beige/85">
                        “{w.message}”
                      </p>
                      <p className="mt-3 font-serif text-[11px] text-jawa-beige/50">
                        {timeAgo(w.createdAt)}
                        {w.approved === false && ' · menunggu moderasi'}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </SectionShell>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pb-16 text-center"
          >
            <OrnateDivider className="mb-6" />
            <p className="mx-auto max-w-2xl font-serif text-[12.5px] italic leading-relaxed text-jawa-beige/55">
              Contoh tamu bawaan: <span className="text-jawa-goldlight">{defaultGuest.name}</span>.
              Semua kolom pada dasbor ini dihitung dari repositori aktif — ganti implementasi
              repositori tanpa mengubah halaman ini.
            </p>
          </motion.div>
        </main>
      </div>
    </>
  );
}

function EmptyState({
  text,
  action,
  actionLabel,
}: {
  text: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-jawa-gold/30 bg-jawa-espresso/40 px-6 py-12 text-center">
      <OrnateDivider className="opacity-60" />
      <p className="max-w-md font-serif text-sm italic text-jawa-beige/65">{text}</p>
      {action && actionLabel && (
        <GoldButton size="sm" variant="outline" onClick={action}>
          {actionLabel}
        </GoldButton>
      )}
    </div>
  );
}
