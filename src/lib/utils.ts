import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Gabungkan class Tailwind dengan aman (menghindari konflik utility). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ID_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const ID_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Format tanggal panjang bahasa Indonesia: "Kamis, 31 Desember 2026" */
export function formatLongDateID(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${ID_DAYS[d.getDay()]}, ${d.getDate()} ${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format singkat: "31 Des 2026" */
export function formatShortDateID(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${ID_MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/** Ambil jam lokal: "08.00" */
export function formatTimeID(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Waktu relatif untuk feed ucapan: "baru saja", "3 jam lalu", "2 hari lalu".
 */
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'baru saja';
  if (min < 60) return `${min} menit lalu`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} bulan lalu`;
  return `${Math.floor(mo / 12)} tahun lalu`;
}

/** Inisial untuk monogram / avatar, maks 2 huruf. */
export function initialsOf(...names: string[]): string {
  return names
    .filter(Boolean)
    .map((n) => n.trim().charAt(0).toUpperCase())
    .join('')
    .slice(0, 3);
}

/**
 * Sanitasi input pengguna. React sudah meng-escape saat render, namun
 * kita tetap membersihkan: membuang karakter kontrol, membatasi panjang,
 * dan menormalkan spasi berlebih. Pertahanan berlapis terhadap XSS /
 * injection payload yang mungkin disimpan ke database.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    // buang karakter kontrol & zero-width
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029]/g, '')
    // netralkan tag HTML agar tidak tersimpan sebagai markup mentah
    .replace(/<[^>]*>/g, '')
    .replace(/\s{3,}/g, '  ')
    .trim()
    .slice(0, maxLength);
}

/** Nama tamu yang aman untuk ditampilkan (maks 60 karakter). */
export function sanitizeName(input: unknown): string {
  return sanitizeText(input, 60);
}

/** Validasi nama: minimal 2 huruf, tidak hanya angka/simbol. */
export function isValidName(name: string): boolean {
  const clean = name.trim();
  return clean.length >= 2 && clean.length <= 60 && /[a-zA-Z\u00C0-\u024F]/.test(clean);
}

/** Cek jumlah tamu valid (1–20). */
export function isValidGuestCount(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= 20;
}

/** Salin ke clipboard dengan fallback untuk browser lama / non-HTTPS. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* lanjut ke fallback */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Buat link Google Calendar (unduh acara ke kalender tamu). */
export function googleCalendarUrl(opts: {
  title: string;
  details?: string;
  location: string;
  startISO: string;
  endISO: string;
}): string {
  const stamp = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${stamp(opts.startISO)}/${stamp(opts.endISO)}`,
    details: opts.details ?? '',
    location: opts.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Link share WhatsApp untuk mengirim undangan ke orang lain. */
export function whatsappShareUrl(url: string, text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

/** Batasi nilai detik/menit agar tidak negatif. */
export function clampNonNegative(n: number): number {
  return n < 0 ? 0 : n;
}

/** Deteksi preferensi reduced motion (aman saat SSR / tanpa window). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** ID unik sederhana tanpa dependensi eksternal. */
export function uid(prefix = 'id'): string {
  const rand = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
