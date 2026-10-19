import type { InvitationConfig } from '../../types/invitation';
import { defaultGuest, invitationRegistry, jawaIvory, jawaMaroon, jawaRoyal } from './jawaRoyal';

/**
 * ============================================================================
 *  KATALOG UNDANGAN
 * ============================================================================
 *  Ini titik masuk tunggal untuk seluruh data undangan. Saat pindah ke
 *  Supabase, cukup ubah `invitationRegistry` menjadi hasil query — seluruh
 *  komponen tidak perlu disentuh.
 * ============================================================================
 */

export { defaultGuest, invitationRegistry, jawaIvory, jawaMaroon, jawaRoyal };

/** Nilai yang jelas-jelas masih data contoh. */
const DEMO_MARKERS = ['images.unsplash.com', 'demo@undanganjawa.id'];

/**
 * Apakah undangan ini sudah memakai data asli (bukan contoh)?
 * Dipakai untuk menampilkan peringatan di dasbor — bukan untuk memblokir.
 */
export function isConfigured(config: InvitationConfig): boolean {
  const haystack = JSON.stringify(config);
  return !DEMO_MARKERS.some((marker) => haystack.includes(marker));
}

/**
 * Semua undangan yang boleh dibuka publik (published / preview).
 * Diurutkan: yang sudah rilis lebih dahulu, lalu berdasarkan slug.
 */
export function liveInvitations(): InvitationConfig[] {
  const seen = new Set<string>();
  const all = Object.values(invitationRegistry).filter((inv) => {
    if (!inv || inv.status === 'draft' || inv.status === 'archived') return false;
    if (seen.has(inv.slug)) return false;
    seen.add(inv.slug);
    return true;
  });

  const rank: Record<string, number> = { published: 0, preview: 1, expired: 2 };
  return all.sort((a, b) => {
    const ra = rank[a.status] ?? 9;
    const rb = rank[b.status] ?? 9;
    if (ra !== rb) return ra - rb;
    return a.slug.localeCompare(b.slug);
  });
}

/** Cari undangan berdasarkan slug, abaikan perbedaan huruf besar/kecil. */
export function findInvitation(slug: string): InvitationConfig | undefined {
  if (!slug) return undefined;
  const key = slug.trim().toLowerCase();
  if (invitationRegistry[key]) return invitationRegistry[key];
  return Object.values(invitationRegistry).find((inv) => inv.slug.toLowerCase() === key);
}

/** Cari berdasarkan id template (dipakai oleh rute /demo/:template). */
export function findByTemplate(template: string): InvitationConfig | undefined {
  const key = template.trim().toLowerCase();
  if (invitationRegistry[key]) return invitationRegistry[key];
  return Object.values(invitationRegistry).find((inv) => inv.template === key);
}

/** Semua template unik untuk galeri pilihan tema. */
export function templatePreviews(): InvitationConfig[] {
  const seen = new Set<string>();
  return Object.values(invitationRegistry).filter((inv) => {
    if (seen.has(inv.template)) return false;
    seen.add(inv.template);
    return true;
  });
}
