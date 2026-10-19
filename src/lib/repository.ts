import type { RsvpEntry, WishEntry } from '../types/invitation';
import { sanitizeName, sanitizeText, uid, isValidName, isValidGuestCount } from './utils';

/**
 * ============================================================================
 *  DATA LAYER  ·  Repository Pattern
 * ============================================================================
 *  Seluruh komponen UI hanya berbicara dengan interface `InvitationRepository`.
 *  Saat ini implementasi default adalah `LocalStorageRepository` (demo).
 *
 *  ➜ Untuk produksi, buat `SupabaseRepository` yang mengimplementasikan
 *    interface yang sama, lalu ganti `activeRepository` di bawah.
 *    Skema SQL untuk Supabase tersedia di `supabase/schema.sql`.
 *
 *  PENTING: service-role key TIDAK boleh ada di frontend. Gunakan anon key
 *  + Row Level Security, atau proxy melalui Supabase Edge Function.
 * ============================================================================
 */

export interface SubmitResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface InvitationRepository {
  listRsvp(slug: string): Promise<RsvpEntry[]>;
  createRsvp(slug: string, input: Omit<RsvpEntry, 'id' | 'createdAt'>): Promise<SubmitResult<RsvpEntry>>;
  listWishes(slug: string, limit?: number): Promise<WishEntry[]>;
  createWish(slug: string, input: Omit<WishEntry, 'id' | 'createdAt' | 'approved'>): Promise<SubmitResult<WishEntry>>;
  /** Ringkasan agregat untuk halaman admin. */
  summarize(slug: string): Promise<{ hadir: number; tidakHadir: number; ragu: number; totalGuests: number }>;
}

const RSVP_KEY = (slug: string) => `uj:rsvp:${slug}`;
const WISH_KEY = (slug: string) => `uj:wish:${slug}`;
const PII_KEY = 'uj:guest-identity';
const RATE_KEY = 'uj:rate-limit';

/** Baca JSON dari localStorage tanpa melempar error. */
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage penuh atau diblokir — abaikan, data tetap ada di memori sesi */
  }
}

/**
 * Rate limit sederhana berbasis localStorage: maksimum 5 kiriman per 10 menit.
 * Ini hanya lapisan pertama; proteksi sebenarnya WAJIB dilakukan di server.
 */
function checkRateLimit(action: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const map = readJSON<Record<string, number[]>>(RATE_KEY, {});
  const hits = (map[action] ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  map[action] = hits;
  writeJSON(RATE_KEY, map);
  return true;
}

/**
 * Deteksi pesan spam ringan: terlalu banyak URL, atau teks berulang.
 * Moderasi sesungguhnya dilakukan di server (lihat catatan di schema.sql).
 */
function looksLikeSpam(message: string): boolean {
  const urlCount = (message.match(/https?:\/\//g) ?? []).length;
  if (urlCount > 1) return true;
  const stripped = message.replace(/\s/g, '');
  if (stripped.length > 12) {
    const unique = new Set(stripped).size;
    if (unique / stripped.length < 0.15) return true;
  }
  return false;
}

class LocalStorageRepository implements InvitationRepository {
  async listRsvp(slug: string): Promise<RsvpEntry[]> {
    return readJSON<RsvpEntry[]>(RSVP_KEY(slug), []).sort((a, b) => b.createdAt - a.createdAt);
  }

  async createRsvp(
    slug: string,
    input: Omit<RsvpEntry, 'id' | 'createdAt'>,
  ): Promise<SubmitResult<RsvpEntry>> {
    const name = sanitizeName(input.name);
    if (!isValidName(name)) {
      return { ok: false, error: 'Nama minimal 2 karakter dan tidak boleh hanya berupa angka.' };
    }
    if (!isValidGuestCount(input.guests)) {
      return { ok: false, error: 'Jumlah tamu harus antara 1 sampai 20 orang.' };
    }
    if (!checkRateLimit(`rsvp:${slug}`)) {
      return { ok: false, error: 'Terlalu banyak percobaan. Silakan coba lagi beberapa menit lagi.' };
    }

    const entry: RsvpEntry = {
      id: uid('rsvp'),
      name,
      guests: input.guests,
      attendance: input.attendance,
      session: input.session ? sanitizeText(input.session, 40) : undefined,
      message: input.message ? sanitizeText(input.message, 400) : undefined,
      createdAt: Date.now(),
    };

    const all = await this.listRsvp(slug);
    writeJSON(RSVP_KEY(slug), [entry, ...all].slice(0, 500));
    return { ok: true, data: entry };
  }

  async listWishes(slug: string): Promise<WishEntry[]> {
    return readJSON<WishEntry[]>(WISH_KEY(slug), [])
      .filter((w) => w.approved !== false)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async createWish(
    slug: string,
    input: Omit<WishEntry, 'id' | 'createdAt' | 'approved'>,
  ): Promise<SubmitResult<WishEntry>> {
    const name = sanitizeName(input.name);
    const message = sanitizeText(input.message, 500);

    if (!isValidName(name)) {
      return { ok: false, error: 'Nama minimal 2 karakter dan tidak boleh hanya berupa angka.' };
    }
    if (message.length < 3) {
      return { ok: false, error: 'Ucapan terlalu pendek. Tuliskan minimal 3 karakter.' };
    }
    if (!checkRateLimit(`wish:${slug}`)) {
      return { ok: false, error: 'Terlalu banyak ucapan terkirim. Coba lagi beberapa menit lagi.' };
    }

    const entry: WishEntry = {
      id: uid('wish'),
      name,
      relation: sanitizeText(input.relation, 40) || 'lainnya',
      message,
      attendance: input.attendance,
      createdAt: Date.now(),
      // Moderasi dasar: konten yang menyerupai spam masuk antrean tunggu.
      approved: !looksLikeSpam(message),
    };

    const all = readJSON<WishEntry[]>(WISH_KEY(slug), []);
    writeJSON(WISH_KEY(slug), [entry, ...all].slice(0, 1000));
    return {
      ok: true,
      data: entry,
      error: entry.approved ? undefined : 'Ucapan Anda menunggu moderasi sebelum ditampilkan.',
    };
  }

  async summarize(slug: string) {
    const rsvp = await this.listRsvp(slug);
    return {
      hadir: rsvp.filter((r) => r.attendance === 'hadir').length,
      tidakHadir: rsvp.filter((r) => r.attendance === 'tidak-hadir').length,
      ragu: rsvp.filter((r) => r.attendance === 'ragu').length,
      totalGuests: rsvp
        .filter((r) => r.attendance === 'hadir')
        .reduce((sum, r) => sum + r.guests, 0),
    };
  }
}

/* --------------------------------------------------------------------------
 *  Preferensi tamu (non-sensitif saja). Kita TIDAK menyimpan data pribadi
 *  yang tidak diperlukan — hanya nama & relasi untuk mengisi form otomatis.
 * ------------------------------------------------------------------------ */
export function rememberGuestIdentity(name: string, relation?: string): void {
  writeJSON(PII_KEY, { name: sanitizeName(name), relation: relation ?? '' });
}

export function recallGuestIdentity(): { name: string; relation: string } {
  return readJSON<{ name: string; relation: string }>(PII_KEY, { name: '', relation: '' });
}

export function forgetGuestIdentity(): void {
  try {
    localStorage.removeItem(PII_KEY);
    localStorage.removeItem(RATE_KEY);
  } catch {
    /* noop */
  }
}

/** Implementasi aktif. Ganti baris ini saat Supabase sudah siap. */
export const activeRepository: InvitationRepository = new LocalStorageRepository();
