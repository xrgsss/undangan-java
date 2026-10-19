import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Heart,
  Landmark,
  Link2,
  Music2,
  Palette,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { JogloScene } from '../components/ornaments/JogloScene';
import { Gunungan } from '../components/ornaments/Gunungan';
import { OrnamentDefs } from '../components/ornaments/OrnamentDefs';
import { FloralCorner, OrnateDivider, UkelFlourish } from '../components/ornaments/Ornaments';
import { WayangFigure } from '../components/ornaments/WayangFigure';
import { BatikBackdrop } from '../components/sections/decor';
import { GoldButton, GoldPill, Reveal, SectionShell, StaggerText } from '../components/ui/primitives';
import { copyToClipboard } from '../lib/utils';
import { liveInvitations } from '../data/invitations';

/**
 * ============================================================================
 *  LANDING PAGE  ·  halaman produk
 * ============================================================================
 *  Ini BUKAN bagian undangan. Halaman ini menjelaskan produk, menampilkan
 *  daftar undangan yang sudah dibuat, dan menyediakan pembuat tautan tamu.
 *
 *  Catatan jujur: belum ada backend pembayaran/langganan. Tombol paket
 *  diarahkan ke kontak, bukan ke alur pembayaran palsu.
 * ============================================================================
 */

const FEATURES = [
  {
    icon: Palette,
    title: 'Template Adat yang Dapat Diganti',
    body: 'Tampilan Jawa Royal, Ivory, dan Maroon dipisahkan dari data undangan. Ganti pelanggan tanpa menyentuh kode.',
  },
  {
    icon: Landmark,
    title: 'Ilustrasi Vektor Orisinal',
    body: 'Gunungan, wayang Arjuna & Srikandi, motif batik parang/kawung/truntum, serta joglo berlapis — dibangun sebagai SVG, bukan potongan gambar.',
  },
  {
    icon: Music2,
    title: 'Gamelan Bebas Royalti',
    body: 'Gendhing Jawa disintesis langsung di peramban lewat Web Audio API, jadi tetap berbunyi tanpa internet dan tanpa masalah hak cipta.',
  },
  {
    icon: Zap,
    title: 'Ringan & Cepat',
    body: 'Tidak ada pustaka animasi berat, peta dimuat hanya saat diminta, gambar lambat-dimuat dengan placeholder bermotif.',
  },
  {
    icon: ShieldCheck,
    title: 'Formulir Aman',
    body: 'Ucapan & konfirmasi disanitasi berlapis, dibatasi laju pengiriman, dan dimoderasi otomatis sebelum ditampilkan.',
  },
  {
    icon: BookOpen,
    title: 'Kisah, Galeri, & Adat',
    body: 'Empat belas bagian lengkap: pembuka, ayat, mempelai, acara, hitung mundur, kisah, galeri, adat Jawa, lokasi, RSVP, ucapan, hadiah, dan penutup.',
  },
];

/** Tahun berjalan untuk footer — dihitung sekali saat modul dimuat. */
const CURRENT_YEAR = new Date().getFullYear();

export function LandingPage({ navigate }: { navigate: (to: string) => void }) {
  const invitations = liveInvitations();
  const firstSlug = invitations[0]?.slug ?? 'eliana-syahril';

  const guestUrl = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return origin;
  }, []);

  return (
    <>
      <OrnamentDefs />

      <div className="relative min-h-screen overflow-x-hidden">
        {/* ================= HERO ================= */}
        <section className="relative isolate min-h-[100svh] overflow-hidden">
          <JogloScene className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-jawa-espresso/85 via-jawa-espresso/55 to-jawa-espresso" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 py-24 sm:px-10">
            <div className="pointer-events-none absolute -left-6 top-1/4 hidden w-40 opacity-45 lg:block">
              <WayangFigure variant="arjuna" animated className="h-auto w-full" />
            </div>
            <div className="pointer-events-none absolute -right-6 top-1/4 hidden w-40 -scale-x-100 opacity-45 lg:block">
              <WayangFigure variant="srikandi" animated className="h-auto w-full" />
            </div>

            <Reveal y={-12}>
              <GoldPill>
                <Sparkles size={11} /> Undangan Digital Adat Jawa
              </GoldPill>
            </Reveal>

            <Reveal delay={0.1} className="mt-6">
              <UkelFlourish className="h-10 w-48 opacity-85 sm:h-12 sm:w-64" />
            </Reveal>

            <StaggerText
              as="h1"
              text="Pawiwahan Ageng ing Alam Digital"
              className="mt-6 max-w-3xl font-cinzeldec text-[2.1rem] leading-[1.1] text-gold-gradient text-gold-glow sm:text-5xl lg:text-6xl"
            />

            <Reveal delay={0.4} className="mt-6 max-w-2xl">
              <p className="font-serif text-base leading-[1.95] text-jawa-beige/90 sm:text-lg">
                Undangan pernikahan bernuansa keraton: gunungan yang bercahaya, wayang yang
                bergerak seperti dimainkan dalang, gamelan yang mengalun, dan empat belas bagian
                yang menuntun tamu dari halaman pembuka hingga ucapan penutup.
              </p>
            </Reveal>

            <Reveal delay={0.55} className="mt-9 flex flex-wrap items-center gap-3">
              <GoldButton
                size="lg"
                onClick={() => navigate(`/demo/jawa-royal`)}
                ariaLabel="Buka contoh undangan"
              >
                Lihat Contoh Undangan <ArrowRight size={15} />
              </GoldButton>
              <GoldButton size="lg" variant="outline" onClick={() => navigate('/admin')}>
                Dasbor Tamu
              </GoldButton>
            </Reveal>

            <Reveal delay={0.7} className="mt-8">
              <OrnateDivider />
            </Reveal>

            <Reveal delay={0.8} className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: '14 Bagian Lengkap', icon: BookOpen },
                { label: 'Gamelan Sintetis', icon: Music2 },
                { label: 'Peta & RSVP', icon: QrCode },
                { label: 'Tanpa Klaim Palsu', icon: ShieldCheck },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <span key={f.label} className="flex items-center gap-2 font-cinzel text-[10px] uppercase tracking-[0.26em] text-jawa-beige/70">
                    <Icon size={13} className="text-jawa-gold" />
                    {f.label}
                  </span>
                );
              })}
            </Reveal>
          </div>

          <FloralCorner className="pointer-events-none absolute -bottom-6 -left-8 w-[70%] max-w-md opacity-55 sm:w-[38%]" />
          <FloralCorner mirror className="pointer-events-none absolute -bottom-6 -right-8 w-[70%] max-w-md opacity-55 sm:w-[38%]" />
        </section>

        {/* ================= DAFTAR UNDANGAN ================= */}
        <SectionShell
          id="undangan"
          eyebrow="Koleksi"
          title="Undangan yang Siap Dilihat"
          subtitle="Setiap tautan di bawah memakai data undangan yang berbeda namun berbagi mesin template yang sama."
          motif="kawung"
          motifOpacity={0.06}
          width="wide"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {invitations.map((inv, i) => (
              <Reveal key={inv.slug} delay={i * 0.08}>
                <article className="glass-royal-card glass-royal-card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-jawa-gold/25 bg-jawa-deepbrown">
                    <BatikBackdrop opacity={0.12} motif={i % 2 === 0 ? 'parang' : 'kawung'} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gunungan flames={false} glow={false} className="h-[86%] w-auto opacity-90 transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <span className="absolute left-3 top-3 rounded-full border border-jawa-gold/45 bg-jawa-espresso/75 px-2.5 py-1 font-cinzel text-[9px] uppercase tracking-[0.2em] text-jawa-goldlight">
                      {inv.template}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-cinzeldec text-xl text-jawa-ivory">
                      {inv.groom.nickname} &amp; {inv.bride.nickname}
                    </h3>
                    <p className="mt-1.5 font-serif text-sm text-jawa-beige/75">
                      {inv.weddingDayLabel}, {inv.weddingDateLabel}
                    </p>
                    <p className="mt-1 font-serif text-[12.5px] text-jawa-beige/60">
                      {inv.events[0]?.venueName}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <GoldPill className="text-[9px]">{inv.plan === 'premium' ? 'Premium' : 'Gratis'}</GoldPill>
                      <GoldPill className="text-[9px]">{inv.status}</GoldPill>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <GoldButton size="sm" onClick={() => navigate(`/r/${inv.slug}?to=Tamu%20Undangan`)}>
                        Buka Undangan
                      </GoldButton>
                      <GoldButton size="sm" variant="outline" onClick={() => navigate(`/demo/${inv.template}`)}>
                        Mode Demo
                      </GoldButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </SectionShell>

        {/* ================= FITUR ================= */}
        <SectionShell
          id="fitur"
          eyebrow="Di Balik Layar"
          title="Yang Membedakan Undangan Ini"
          subtitle="Dibangun sebagai produk yang dapat dipakai berulang, bukan satu halaman sekali pakai."
          motif="truntum"
          motifOpacity={0.06}
          width="wide"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="glass-royal-card glass-royal-card-hover h-full rounded-2xl p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-jawa-gold/40 bg-jawa-gold/10 text-jawa-goldlight">
                      <Icon size={17} />
                    </span>
                    <h3 className="mt-4 font-cinzel text-base text-jawa-ivory">{f.title}</h3>
                    <p className="mt-2 font-serif text-[13.5px] leading-relaxed text-jawa-beige/80">
                      {f.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </SectionShell>

        {/* ================= PEMBUAT TAUTAN TAMU ================= */}
        <GuestLinkTool slug={firstSlug} origin={guestUrl} navigate={navigate} />

        {/* ================= PAKET (JUJUR) ================= */}
        <SectionShell
          id="paket"
          eyebrow="Paket"
          title="Harga & Langganan"
          subtitle="Belum ada sistem pembayaran di dalam aplikasi ini."
          motif="ceplok"
          motifOpacity={0.06}
          width="wide"
        >
          <Reveal className="mb-8">
            <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-jawa-gold/30 bg-jawa-espresso/55 px-5 py-4">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-jawa-gold" />
              <p className="font-serif text-[13px] leading-relaxed text-jawa-beige/85 sm:text-sm">
                <span className="font-semibold text-jawa-goldlight">Catatan transparansi:</span>{' '}
                aplikasi ini tidak memproses pembayaran, tidak memiliki akun pengguna, dan tidak
                menyimpan data di server. Seluruh konfirmasi tamu pada versi demo tersimpan di
                peramban masing-masing tamu. Untuk produksi, sambungkan repositori data ke
                Supabase (lihat <code className="rounded bg-jawa-espresso/70 px-1.5 py-0.5 font-mono text-[11px]">supabase/schema.sql</code>).
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Gratis',
                price: 'Rp 0',
                note: 'Untuk mencoba',
                items: [
                  '1 template dasar',
                  'Semua 14 bagian undangan',
                  'Gamelan sintetis',
                  'Data tamu tersimpan lokal',
                ],
                highlight: false,
              },
              {
                name: 'Premium',
                price: 'Sesuai Kesepakatan',
                note: 'Hubungi kami',
                items: [
                  'Semua template & varian warna',
                  'Musik milik Anda sendiri',
                  'Penyimpanan data terpusat',
                  'Dasbor tamu & ekspor',
                  'Masa aktif 12 bulan',
                ],
                highlight: true,
              },
              {
                name: 'Kustom',
                price: 'Sesuai Kesepakatan',
                note: 'Hubungi kami',
                items: [
                  'Desain ornamen khusus',
                  'Domain sendiri',
                  'Integrasi undangan & QR tamu',
                  'Pendampingan penuh',
                ],
                highlight: false,
              },
            ].map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.08}>
                <div
                  className={
                    tier.highlight
                      ? 'gold-frame-double relative flex h-full flex-col rounded-3xl bg-jawa-espresso/75 p-6'
                      : 'glass-royal-card relative flex h-full flex-col rounded-3xl p-6'
                  }
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-jawa-goldlight to-jawa-golddark px-3 py-1 font-cinzel text-[9px] uppercase tracking-[0.24em] text-jawa-chocolate">
                      Paling Diminati
                    </span>
                  )}
                  <p className="font-cinzel text-sm uppercase tracking-[0.28em] text-jawa-gold">{tier.name}</p>
                  <p className="mt-3 font-cinzeldec text-2xl text-jawa-ivory">{tier.price}</p>
                  <p className="mt-1 font-serif text-xs italic text-jawa-beige/60">{tier.note}</p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {tier.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 font-serif text-[13.5px] text-jawa-beige/85">
                        <Check size={14} className="mt-0.5 shrink-0 text-jawa-gold" />
                        {it}
                      </li>
                    ))}
                  </ul>

                  <GoldButton
                    className="mt-7 w-full"
                    variant={tier.highlight ? 'solid' : 'outline'}
                    href="mailto:halo@undanganjawa.id?subject=Paket%20Undangan"
                  >
                    <Heart size={13} /> Hubungi Kami
                  </GoldButton>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionShell>

        {/* ================= FOOTER ================= */}
        <footer className="relative border-t border-jawa-gold/20 px-6 py-14">
          <BatikBackdrop opacity={0.06} motif="ukiran" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
            <Gunungan flames={false} glow={false} className="h-16 w-auto opacity-80" />
            <p className="font-cinzeldec text-xl text-gold-gradient">Undangan Jawa</p>
            <p className="max-w-xl font-serif text-sm italic leading-relaxed text-jawa-beige/70">
              Undangan digital bernuansa adat Jawa. Dibuat untuk dipakai berulang kali dengan
              data yang berbeda.
            </p>
            <OrnateDivider className="my-2" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="font-cinzel text-[10px] uppercase tracking-[0.28em] text-jawa-beige/60 transition hover:text-jawa-goldlight"
              >
                Dasbor Tamu
              </button>
              <button
                type="button"
                onClick={() => navigate('/demo/jawa-royal')}
                className="font-cinzel text-[10px] uppercase tracking-[0.28em] text-jawa-beige/60 transition hover:text-jawa-goldlight"
              >
                Contoh Undangan
              </button>
              <span className="font-cinzel text-[10px] uppercase tracking-[0.28em] text-jawa-beige/40">
                © {CURRENT_YEAR}
              </span>
            </div>
          </div>
        </footer>
      </div>

      <LandingNav navigate={navigate} />
    </>
  );
}

/* ---------------------------------------------------------------------------
 *  Navigasi halaman produk (bilah atas yang menyusut saat digulir)
 * ------------------------------------------------------------------------ */

const LANDING_LINKS = [
  { id: 'undangan', label: 'Undangan' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'tautan', label: 'Tautan Tamu' },
  { id: 'paket', label: 'Paket' },
];

function LandingNav({ navigate }: { navigate: (to: string) => void }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ' +
        (solid
          ? 'border-b border-jawa-gold/25 bg-jawa-espresso/85 backdrop-blur-md'
          : 'border-b border-transparent')
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
          aria-label="Undangan Jawa — beranda"
        >
          <Gunungan flames={false} glow={false} className="h-8 w-auto" />
          <span className="font-cinzeldec text-base text-gold-gradient sm:text-lg">Undangan Jawa</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi halaman">
          {LANDING_LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => jump(l.id)}
              className="rounded-full px-3.5 py-2 font-cinzel text-[10px] uppercase tracking-[0.22em] text-jawa-beige/70 transition hover:bg-jawa-gold/10 hover:text-jawa-goldlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="hidden rounded-full border border-jawa-gold/35 px-3.5 py-2 font-cinzel text-[10px] uppercase tracking-[0.22em] text-jawa-beige/75 transition hover:border-jawa-gold hover:text-jawa-goldlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70 sm:inline-flex"
          >
            Dasbor
          </button>
          <GoldButton size="sm" onClick={() => navigate('/demo/jawa-royal')}>
            Contoh
          </GoldButton>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------------
 *  Alat pembuat tautan tamu
 * ------------------------------------------------------------------------ */

function GuestLinkTool({
  slug,
  origin,
  navigate,
}: {
  slug: string;
  origin: string;
  navigate: (to: string) => void;
}) {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('Tamu Undangan');
  const [copied, setCopied] = useState(false);

  const cleanName = name.trim();
  const encodedName = encodeURIComponent(cleanName || 'Tamu Undangan');
  const encodedLabel = encodeURIComponent(label.trim() || 'Tamu Undangan');
  const link = `${origin}/r/${slug}?to=${encodedName}&label=${encodedLabel}`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(link);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <SectionShell
      id="tautan"
      eyebrow="Alat Bantu"
      title="Pembuat Tautan Tamu"
      subtitle="Buat tautan personal sehingga nama tamu langsung tampil di halaman pembuka undangan."
      motif="parang"
      motifOpacity={0.06}
      width="narrow"
    >
      <Reveal>
        <div className="gold-frame-double rounded-3xl bg-jawa-espresso/65 px-5 py-7 backdrop-blur-sm sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="gen-name" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                Nama Tamu
              </label>
              <input
                id="gen-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mis. Bapak Hartono"
                className="w-full rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory placeholder:text-jawa-beige/40 focus:border-jawa-gold focus:outline-none focus:ring-1 focus:ring-jawa-gold/50"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="gen-label" className="mb-2 block font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
                Keterangan
              </label>
              <input
                id="gen-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Mis. Keluarga / Teman"
                className="w-full rounded-xl border border-jawa-gold/35 bg-jawa-chocolate/60 px-4 py-3 font-serif text-base text-jawa-ivory placeholder:text-jawa-beige/40 focus:border-jawa-gold focus:outline-none focus:ring-1 focus:ring-jawa-gold/50"
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold">
              Hasil Tautan
            </p>
            <p className="break-all rounded-xl border border-jawa-gold/30 bg-jawa-chocolate/50 px-4 py-3 font-mono text-[11.5px] text-jawa-goldlight/90">
              {link}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <GoldButton size="sm" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Tersalin' : 'Salin Tautan'}
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/r/${slug}?to=${encodedName}&label=${encodedLabel}`)}
            >
              <Link2 size={13} /> Coba Sekarang
            </GoldButton>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
