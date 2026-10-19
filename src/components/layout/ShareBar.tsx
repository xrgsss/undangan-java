import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Link2, Share2, X } from 'lucide-react';
import { copyToClipboard, whatsappShareUrl } from '../../lib/utils';
import { GoldButton } from '../ui/primitives';

/* --------------------------------------------------------------------------
 *  Glyph merek — digambar sendiri sebagai SVG (bukan ikon pihak ketiga)
 * ------------------------------------------------------------------------ */

function GlyphWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.28L2 22l5-1.62a9.9 9.9 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm5.72 13.9c-.24.68-1.4 1.3-1.94 1.34-.54.06-1.02.24-3.5-.8-2.98-1.24-4.82-4.4-4.96-4.6-.14-.2-1.16-1.6-1.16-3.04 0-1.44.76-2.14 1.02-2.44.26-.3.56-.36.76-.36l.54.02c.18 0 .4-.06.62.48.24.58.8 2.02.86 2.16.06.14.1.3.02.48-.1.2-.4.62-.6.84-.1.12-.24.24-.06.5.18.26.8 1.3 1.72 2.1 1.18 1.04 2.16 1.36 2.46 1.52.3.14.48.12.66-.08.18-.2.76-.9.96-1.2.2-.3.4-.24.68-.14.26.1 1.7.8 2 .94.3.16.5.24.58.36.06.14.06.78-.18 1.46Z" />
    </svg>
  );
}

function GlyphTelegram() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M21.7 4.2 2.9 11.4c-1 .4-1 1.7.1 2l4.4 1.4 1.6 5.1c.2.6 1 .8 1.4.3l2.4-2.4 4.6 3.4c.5.4 1.3.1 1.4-.6l2.5-15c.1-.8-.6-1.4-1.3-1.1Zm-3.3 3-7 6.3-.3 3-1.3-4 8.9-6.2c.3-.2.6.2.3.5Z" />
    </svg>
  );
}

function GlyphX() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.4-5.7L6 21H2.9l7.1-8.1L2.6 3h6.3l4 5.3L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
    </svg>
  );
}

/**
 * Bilah berbagi undangan.
 *  · Menyalin tautan undangan (dengan nama tamu bila tersedia).
 *  · Membagikan ke WhatsApp / Telegram / X.
 *  · Menjelaskan cara membuat tautan personal untuk tamu lain
 *    (parameter ?to=Nama%20Tamu).
 */
export function ShareBar({ title, className }: { title: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState<'none' | 'plain' | 'guest'>('none');

  /** Baca tautan saat ini tepat ketika panel dibuka (bukan saat render). */
  const openPanel = () => {
    if (typeof window !== 'undefined') setUrl(window.location.href);
    setOpen(true);
  };

  useEffect(() => {
    if (copied === 'none') return;
    const t = window.setTimeout(() => setCopied('none'), 2400);
    return () => window.clearTimeout(t);
  }, [copied]);

  const baseUrl = (() => {
    try {
      const u = new URL(url);
      u.search = '';
      u.hash = '';
      return u.toString();
    } catch {
      return url;
    }
  })();

  const handleCopy = async (kind: 'plain' | 'guest') => {
    const target =
      kind === 'guest'
        ? `${baseUrl}?to=Nama%20Tamu&label=Keluarga`
        : baseUrl;
    const ok = await copyToClipboard(target);
    if (ok) setCopied(kind);
  };

  const shareText = `${title} — Kami mengundang Anda untuk hadir dan memberikan doa restu.`;

  const channels: { label: string; glyph: ReactNode; href: string }[] = [
    {
      label: 'WhatsApp',
      glyph: <GlyphWhatsApp />,
      href: whatsappShareUrl(baseUrl, shareText),
    },
    {
      label: 'Telegram',
      glyph: <GlyphTelegram />,
      href: `https://t.me/share/url?url=${encodeURIComponent(baseUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'X',
      glyph: <GlyphX />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(baseUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div className={className}>
      <button
        type="button"
        onClick={openPanel}
        className="flex items-center gap-2 rounded-full border border-jawa-gold/40 bg-jawa-espresso/80 px-3.5 py-2 font-cinzel text-[10px] uppercase tracking-[0.22em] text-jawa-goldlight backdrop-blur transition hover:border-jawa-gold hover:bg-jawa-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
        aria-label="Bagikan undangan"
      >
        <Share2 size={13} />
        <span className="hidden sm:inline">Bagikan</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[88] flex items-end justify-center bg-jawa-espresso/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Bagikan undangan"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="gold-frame w-full max-w-lg rounded-t-3xl border border-jawa-gold/40 bg-jawa-espresso/96 px-5 py-6 backdrop-blur-md sm:rounded-3xl sm:px-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-cinzeldec text-xl text-gold-gradient">Bagikan Undangan</h3>
                  <p className="mt-1 font-serif text-sm italic text-jawa-beige/70">
                    Sampaikan kabar bahagia ini kepada kerabat Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-jawa-gold/35 p-1.5 text-jawa-goldlight transition hover:bg-jawa-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
                  aria-label="Tutup"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Tautan */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-jawa-gold/30 bg-jawa-chocolate/50 px-3 py-2.5">
                <Link2 size={14} className="shrink-0 text-jawa-gold" />
                <input
                  readOnly
                  value={baseUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="min-w-0 flex-1 bg-transparent font-serif text-xs text-jawa-beige/85 outline-none"
                  aria-label="Tautan undangan"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <GoldButton size="sm" onClick={() => void handleCopy('plain')}>
                  {copied === 'plain' ? <Check size={13} /> : <Copy size={13} />}
                  {copied === 'plain' ? 'Tersalin' : 'Salin Tautan'}
                </GoldButton>
                <GoldButton size="sm" variant="outline" onClick={() => void handleCopy('guest')}>
                  {copied === 'guest' ? <Check size={13} /> : <Link2 size={13} />}
                  {copied === 'guest' ? 'Tersalin' : 'Salin Pola Tamu'}
                </GoldButton>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 rounded-xl border border-jawa-gold/30 bg-jawa-chocolate/40 px-2 py-3 text-center text-jawa-goldlight transition hover:border-jawa-gold/70 hover:bg-jawa-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jawa-gold/70"
                  >
                    {c.glyph}
                    <span className="font-cinzel text-[9px] uppercase tracking-[0.14em] text-jawa-beige/80">
                      {c.label}
                    </span>
                  </a>
                ))}
              </div>

              {/* Penjelasan tautan personal */}
              <div className="mt-6 rounded-2xl border border-jawa-gold/25 bg-jawa-chocolate/40 px-4 py-4">
                <p className="font-cinzel text-[10px] uppercase tracking-[0.28em] text-jawa-gold">
                  Tautan Personal per Tamu
                </p>
                <p className="mt-2 font-serif text-[12.5px] leading-relaxed text-jawa-beige/80">
                  Tombol <span className="text-jawa-goldlight">Salin Pola Tamu</span> menyalin
                  tautan siap edit. Ganti bagian setelah{' '}
                  <code className="rounded bg-jawa-espresso/70 px-1.5 py-0.5 font-mono text-[11px] text-jawa-goldlight">?to=</code>{' '}
                  dengan nama tamu agar namanya tampil pada halaman pembuka. Contoh:
                </p>
                <p className="mt-2 break-all rounded-lg bg-jawa-espresso/60 px-3 py-2 font-mono text-[10.5px] text-jawa-goldlight/90">
                  {baseUrl}?to=Bapak%20Hartono
                </p>
                <p className="mt-2 font-serif text-[11.5px] italic leading-relaxed text-jawa-beige/60">
                  Tambahkan juga{' '}
                  <code className="rounded bg-jawa-espresso/70 px-1 py-0.5 font-mono text-[10.5px]">&amp;label=Keluarga</code>{' '}
                  untuk mengubah keterangan di bawah nama.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
