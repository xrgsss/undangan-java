import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Building2,
  Check,
  Copy,
  Gift,
  QrCode,
  Smartphone,
  Wallet,
} from 'lucide-react';
import type { BankAccount, InvitationConfig } from '../../types/invitation';
import { Gunungan } from '../ornaments/Gunungan';
import { FloralCorner, OrnateDivider, UkelFlourish } from '../ornaments/Ornaments';
import { GoldButton, GoldPill, Reveal, SectionShell } from '../ui/primitives';
import { useToast } from '../ui/Toast';
import { copyToClipboard } from '../../lib/utils';

/* ==========================================================================
 *  SECTION 13 — AMPLOP DIGITAL
 * ======================================================================== */

const KIND_ICON = {
  bank: Building2,
  ewallet: Smartphone,
  qris: QrCode,
} as const;

function AccountCard({ account, recipientLabel }: { account: BankAccount; recipientLabel: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const Icon = KIND_ICON[account.kind];

  const handleCopy = async () => {
    const ok = await copyToClipboard(account.accountNumber.replace(/[\s-]/g, ''));
    if (ok) {
      setCopied(true);
      toast(`Nomor ${account.provider} tersalin.`, 'success');
      window.setTimeout(() => setCopied(false), 2400);
    } else {
      toast('Gagal menyalin. Silakan salin manual.', 'error');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-jawa-gold/35 bg-gradient-to-br from-jawa-deepbrown/85 to-jawa-espresso/90 p-5 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.9)] transition-all duration-400 hover:border-jawa-gold/70 hover:shadow-[0_24px_60px_-20px_rgba(198,165,107,0.35)]"
    >
      {/* Aksen warna brand */}
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: account.brandColor ?? '#C6A56B' }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-35"
        style={{ background: account.brandColor ?? '#C6A56B' }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-jawa-gold/40 bg-jawa-gold/10 text-jawa-goldlight">
            <Icon size={17} />
          </span>
          <div>
            <p className="font-cinzel text-sm text-jawa-ivory">{account.provider}</p>
            <p className="font-serif text-[11px] uppercase tracking-widest text-jawa-beige/60">
              {account.kind === 'bank' ? 'Transfer Bank' : account.kind === 'ewallet' ? 'Dompet Digital' : 'QRIS'}
            </p>
          </div>
        </div>
        <GoldPill className="shrink-0 border-jawa-gold/30 text-[9px]">{recipientLabel}</GoldPill>
      </div>

      <div className="relative mt-5">
        <p className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-jawa-gold/80">Nomor</p>
        <p className="mt-1.5 select-all font-cinzel text-xl tracking-[0.08em] text-jawa-ivory sm:text-2xl">
          {account.accountNumber}
        </p>
        <p className="mt-2 font-serif text-sm text-jawa-beige/80">a.n. {account.accountName}</p>
      </div>

      <div className="relative mt-5">
        <GoldButton size="sm" variant={copied ? 'solid' : 'outline'} onClick={handleCopy} className="w-full">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Tersalin' : 'Salin Nomor'}
        </GoldButton>
      </div>
    </motion.article>
  );
}

export function GiftSection({ config }: { config: InvitationConfig }) {
  const { gift } = config;
  const { toast } = useToast();
  const [addressCopied, setAddressCopied] = useState(false);

  if (!gift.enabled) return null;
  const accounts = gift.accounts.filter((a) => a.enabled);
  if (accounts.length === 0 && !gift.address.enabled) return null;

  const handleCopyAddress = async () => {
    const text = `${gift.address.recipient}\n${gift.address.address}${
      gift.address.phone ? `\nTelp: ${gift.address.phone}` : ''
    }`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setAddressCopied(true);
      toast('Alamat pengiriman tersalin.', 'success');
      window.setTimeout(() => setAddressCopied(false), 2400);
    }
  };

  return (
    <SectionShell
      id="hadiah"
      eyebrow="Tanda Kasih"
      title={gift.title}
      subtitle={gift.subtitle}
      motif="kawung"
      motifOpacity={0.06}
      width="wide"
    >
      {/* Catatan transparansi: tidak ada data fiktif di produksi */}
      <Reveal className="mb-8">
        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-jawa-gold/25 bg-jawa-espresso/50 px-5 py-4">
          <Gift size={16} className="mt-0.5 shrink-0 text-jawa-gold" />
          <p className="font-serif text-[12.5px] leading-relaxed text-jawa-beige/80 sm:text-sm">
            <span className="font-semibold text-jawa-goldlight">Perhatian pemilik undangan:</span>{' '}
            seluruh nomor rekening dan alamat di bawah ini harus diganti dengan data asli
            sebelum undangan dibagikan. Jangan gunakan contoh data pada produksi.
          </p>
        </div>
      </Reveal>

      {accounts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} recipientLabel={a.accountName.split(' ')[0]} />
          ))}
        </div>
      )}

      {gift.address.enabled && (
        <Reveal delay={0.18} className="mt-8">
          <div className="gold-frame-double relative overflow-hidden rounded-3xl bg-jawa-espresso/65 px-5 py-7 sm:px-8">
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
              <rect width="100%" height="100%" fill="url(#batikCeplok)" color="#C6A56B" />
            </svg>

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-jawa-gold/45 bg-jawa-gold/10 text-jawa-goldlight">
                  <Wallet size={18} />
                </span>
                <div>
                  <p className="font-cinzel text-[10px] uppercase tracking-[0.34em] text-jawa-gold">
                    Kirim Hadiah Fisik
                  </p>
                  <p className="mt-2 font-cinzel text-base text-jawa-ivory">
                    {gift.address.recipient}
                  </p>
                  <p className="mt-1 max-w-md font-serif text-sm leading-relaxed text-jawa-beige/85">
                    {gift.address.address}
                  </p>
                  {gift.address.phone && (
                    <p className="mt-1 font-serif text-sm text-jawa-beige/70">
                      Telp/WA: {gift.address.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5 sm:w-48">
                <span className="hidden justify-center sm:flex">
                  <Gunungan flames={false} glow={false} className="h-16 w-auto opacity-80" />
                </span>
                <GoldButton
                  size="sm"
                  variant={addressCopied ? 'solid' : 'outline'}
                  onClick={handleCopyAddress}
                  className="w-full"
                >
                  {addressCopied ? <Check size={13} /> : <Copy size={13} />}
                  {addressCopied ? 'Tersalin' : 'Salin Alamat'}
                </GoldButton>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.24} className="mt-10 text-center">
        <OrnateDivider />
        <p className="mx-auto mt-6 max-w-lg font-serif text-sm italic leading-relaxed text-jawa-beige/75">
          Tanpa mengurangi rasa hormat, kehadiran dan doa Anda sudah lebih dari cukup bagi kami.
        </p>
        <span className="mt-4 inline-flex">
          <GoldPill>
            <BadgeCheck size={11} /> Doa restu Anda yang utama
          </GoldPill>
        </span>
      </Reveal>
    </SectionShell>
  );
}

/* ==========================================================================
 *  SECTION 14 — PENUTUP
 * ======================================================================== */

/** Nama tampilan untuk setiap template visual. */
const TEMPLATE_LABEL: Record<string, string> = {
  'jawa-royal': 'Jawa Royal',
  'jawa-ivory': 'Jawa Ivory',
  'jawa-maroon': 'Jawa Maroon',
};

/** Tahun berjalan untuk footer — dihitung sekali saat modul dimuat. */
const CURRENT_YEAR = new Date().getFullYear();

export function ClosingSection({ config }: { config: InvitationConfig }) {
  return (
    <section id="penutup" className="relative scroll-mt-20 overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]" aria-hidden="true">
        <rect width="100%" height="100%" fill="url(#batikTruntum)" color="#C6A56B" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-jawa-espresso/40 to-jawa-espresso" aria-hidden="true" />

      {/* Gunungan besar di belakang */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 w-[96vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 0.18, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <Gunungan className="h-auto w-full" />
      </motion.div>

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <UkelFlourish className="mx-auto h-9 w-44 opacity-80 sm:h-11 sm:w-56" />
        </Reveal>

        <Reveal delay={0.14}>
          <h2 className="mt-6 font-cinzeldec text-3xl leading-tight text-gold-gradient sm:text-4xl md:text-[2.6rem]">
            Matur Nuwun
          </h2>
        </Reveal>

        <Reveal delay={0.24}>
          <OrnateDivider className="my-6" />
        </Reveal>

        <Reveal delay={0.3}>
          <p className="font-serif text-[1.02rem] leading-[2] text-jawa-beige sm:text-lg sm:leading-[2.05]">
            {config.closing.text}
          </p>
        </Reveal>

        <Reveal delay={0.4} className="mt-10">
          <p className="font-cinzel text-[10px] uppercase tracking-[0.42em] text-jawa-gold">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
        </Reveal>

        <Reveal delay={0.5} className="mt-10">
          <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-jawa-beige/80">
            {config.closing.familyLine}
          </p>
          <p className="mt-6 font-script text-4xl text-shimmer sm:text-5xl">
            {config.groom.nickname} &amp; {config.bride.nickname}
          </p>
        </Reveal>
      </div>

      {/* Ornamen bunga bawah */}
      <div className="pointer-events-none absolute -bottom-10 left-0 w-[70%] max-w-[420px] opacity-50 sm:w-[38%]">
        <FloralCorner className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute -bottom-10 right-0 w-[70%] max-w-[420px] opacity-50 sm:w-[38%]">
        <FloralCorner mirror className="h-auto w-full" />
      </div>

      {/* Footer */}
      <footer className="relative mt-24 border-t border-jawa-gold/20 pt-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          <Gunungan flames={false} glow={false} className="h-12 w-auto opacity-70" />
          <p className="font-cinzel text-[9px] uppercase tracking-[0.36em] text-jawa-gold/70">
            Undangan Digital · Template {TEMPLATE_LABEL[config.template] ?? config.template}
          </p>
          <p className="font-serif text-[11px] italic text-jawa-beige/50">
            Dibuat dengan sepenuh hati untuk kebahagiaan {config.groom.nickname} &amp;{' '}
            {config.bride.nickname}.
          </p>
          <p className="font-cinzel text-[9px] uppercase tracking-[0.3em] text-jawa-beige/40">
            © {CURRENT_YEAR} · All rights reserved
          </p>
        </div>
      </footer>
    </section>
  );
}
